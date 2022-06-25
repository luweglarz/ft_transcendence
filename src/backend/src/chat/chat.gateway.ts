import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomUserService } from './room-user/room-user.service';
import { RoomService } from './room/room.service';
import { MessageService } from './message/message.service';
import { Room, RoomType, User, RoomUser } from '@prisma/client';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private roomUserService: RoomUserService,
    private messageService: MessageService, //private connectedUsers:   {[userId: number]: Socket}
  ) {}
  
 async handleConnection(socket: Socket) {
    
  }
    
  async handleDisconnect(socket: Socket) {

  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() name: string,
    roomType: RoomType,
    owner: User,
    password?: string,
  ) {
    if (roomType === 'PROTECTED' && !password) return 'Error';
    this.roomService.createRoom({
      name,
      password,
      roomType,
      users: { create: { user: { connect: owner }, role: 'OWNER' } },
    });
    // needs emit once i can find how to identify user by connection to server
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(room: Room, user: User) {
    this.roomService.joinRoom(room, user);
    // needs emit once i can find how to identify user by connection to server
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() content: string, room: Room, user: User) {
    this.messageService.createMessage({
      content,
      room: { connect: room },
      user: { connect: user },
    });
    // needs emit once i can find how to identify user by connection to server
  }
}
