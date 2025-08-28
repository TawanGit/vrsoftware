import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService implements OnModuleInit {
  private statusMap = new Map<string, string>();

  constructor(
    private rabbit: RabbitMQService,
    private gateway: NotificationGateway,
  ) {}

  async onModuleInit() {
    await this.initConsumer();
  }

  async sendNotification(mensagemId: string, conteudoMensagem: string) {
    this.statusMap.set(mensagemId, 'AGUARDANDO_PROCESSAMENTO');
    await this.rabbit.publish(this.rabbit.entradaQueue, {
      mensagemId,
      conteudoMensagem,
    });
  }

  async getStatus(mensagemId: string) {
    return this.statusMap.get(mensagemId) || 'NAO_ENCONTRADO';
  }

  private async initConsumer() {
    await this.rabbit.consume(this.rabbit.entradaQueue, async (msg) => {
      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));
      const sucesso = Math.floor(Math.random() * 10) > 2;
      const status = sucesso ? 'PROCESSADO_SUCESSO' : 'FALHA_PROCESSAMENTO';

      await this.rabbit.publish(this.rabbit.statusQueue, {
        mensagemId: msg.mensagemId,
        status,
      });

      this.statusMap.set(msg.mensagemId, status);

      this.gateway.sendStatusUpdate(msg.mensagemId, status);
    });
  }
}
