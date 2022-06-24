import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
