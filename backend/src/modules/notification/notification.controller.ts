import { Controller, Post, Body, Get, Param, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('api/notificar')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async send(@Body() body: any) {
    const { mensagemId, conteudoMensagem } = body;

    if (!conteudoMensagem) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        erro: 'Mensagem não pode ser vazia',
      };
    }

    await this.notificationService.sendNotification(
      mensagemId,
      conteudoMensagem,
    );

    return {
      statusCode: HttpStatus.ACCEPTED,
      mensagemId,
      status: 'AGUARDANDO_PROCESSAMENTO',
    };
  }

  @Get('status/:id')
  async status(@Param('id') id: string) {
    return {
      mensagemId: id,
      status: await this.notificationService.getStatus(id),
    };
  }
}
