import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomUserService } from './room-user/room-user.service';
import { RoomService } from './room/room.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private roomUserService: RoomUserService
  ) {}
  
 async handleConnection(socket: Socket) {
   
  }

  async handleDisconnect(socket: Socket) {
    
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
