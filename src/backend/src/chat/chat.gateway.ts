import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomUserService } from './room-user/room-user.service';
import { RoomService } from './room/room.service';
import { MessageService } from './message/message.service';
import { Room, User } from '@prisma/client';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private roomService:      RoomService,
    private roomUserService:  RoomUserService,
    private messageService:   MessageService
  ) {}
  
 async handleConnection(socket: Socket) {
   
  }

  async handleDisconnect(socket: Socket) {
    
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() content: string, room: Room, user: User) {
    this.messageService.createMessage({content, room: {connect: room}, user: {connect: user}})
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
