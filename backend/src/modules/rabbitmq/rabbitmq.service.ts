import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readyPromise: Promise<void>;

  public readonly entradaQueue = `fila.notificacao.entrada.${process.env.NOME || 'thiago'}`;
  public readonly statusQueue = `fila.notificacao.status.${process.env.NOME || 'thiago'}`;

  private readonly url =
    process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  async onModuleInit() {
    this.readyPromise = this.initWithRetry();
    await this.readyPromise;
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async initWithRetry(): Promise<void> {
    const maxAttempts = 10;
    const delay = 2000;
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        console.log(
          `Tentando conectar ao RabbitMQ (${attempt + 1}/${maxAttempts})...`,
        );
        this.connection = await amqp.connect(this.url);

        this.connection.on('error', (err) => {
          console.error('Erro na conexão RabbitMQ:', err.message);
        });

        this.connection.on('close', async () => {
          console.warn('Conexão RabbitMQ fechada. Tentando reconectar...');
          this.readyPromise = this.initWithRetry();
        });

        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.entradaQueue, { durable: true });
        await this.channel.assertQueue(this.statusQueue, { durable: true });

        console.log('✅ RabbitMQ conectado com sucesso!');
        return;
      } catch (err) {
        attempt++;
        console.warn(`Falha ao conectar RabbitMQ: ${err.message}`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new Error(
      '❌ Não foi possível conectar ao RabbitMQ após várias tentativas.',
    );
  }

  private async ready(): Promise<void> {
    if (this.readyPromise) {
      await this.readyPromise;
    } else {
      await this.initWithRetry();
    }
  }

  async publish(queue: string, message: unknown): Promise<void> {
    await this.ready();
    const payload = Buffer.from(JSON.stringify(message));
    this.channel.sendToQueue(queue, payload, { persistent: true });
  }

  async consume(
    queue: string,
    callback: (msg: any) => Promise<void> | void,
  ): Promise<void> {
    await this.ready();
    await this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          this.channel.ack(msg);
        } catch (err) {
          console.error('Erro ao processar mensagem RabbitMQ:', err);
          this.channel.nack(msg, false, false);
        }
      }
    });
  }

  private async close() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('🔌 Conexão RabbitMQ encerrada com sucesso.');
    } catch (err) {
      console.warn('Erro ao encerrar conexão RabbitMQ:', err.message);
    }
  }
}
