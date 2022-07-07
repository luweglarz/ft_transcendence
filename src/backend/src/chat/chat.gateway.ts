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
    // emit new room to all connected user
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(room: Room, user: User) {
    this.roomService.joinRoom(room, user);
    // needs emit once i can find how to identify user by connection to server
    // emmit room messages to new member of room
  }

  @SubscribeMessage('addMessage')
  async addMessage(@MessageBody() content: string, room: Room, user: User) { // maybe @messagebody is useless or worse
    this.messageService.createMessage({
      content,
      room: { connect: room },
      user: { connect: user },
    });
    // needs emit once i can find how to identify user by connection to server
    // emmit new message to all members of the room
  }
}
