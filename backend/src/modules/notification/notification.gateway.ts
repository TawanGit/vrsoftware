import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendStatusUpdate(mensagemId: string, status: string) {
    this.server.emit('statusUpdate', { mensagemId, status });
  }
}
