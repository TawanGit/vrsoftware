import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { NotificationGateway } from './notification.gateway';

describe('NotificationService', () => {
  let service: NotificationService;
  let rabbitMock: Partial<RabbitMQService>;
  let gatewayMock: Partial<NotificationGateway>;

  beforeEach(async () => {
    rabbitMock = {
      publish: jest.fn().mockResolvedValue(undefined),
      entradaQueue: 'fila.notificacao.entrada.thiago',
      statusQueue: 'fila.notificacao.status.thiago',
    };

    gatewayMock = {
      sendStatusUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: RabbitMQService, useValue: rabbitMock },
        { provide: NotificationGateway, useValue: gatewayMock },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve publicar mensagem no RabbitMQ com os argumentos corretos', async () => {
    const mensagemId = '123-abc';
    const conteudoMensagem = 'Teste de mensagem';

    await service.sendNotification(mensagemId, conteudoMensagem);

    expect(rabbitMock.publish).toHaveBeenCalledWith(
      'fila.notificacao.entrada.thiago',
      { mensagemId, conteudoMensagem },
    );
  });
});
