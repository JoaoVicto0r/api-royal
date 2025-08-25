import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // ajuste conforme seu front-end
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  sendMessage(payload: any) {
    this.server.emit('newMessage', payload);
  }

  sendQrCode(qr: string) {
    this.server.emit('qrCode', qr);
  }
}
