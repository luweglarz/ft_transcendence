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
import { JwtService } from '@nestjs/jwt'
import { DbService } from 'src/db/db.service';
import { Room, RoomType, User, RoomUser, Message } from '@prisma/client';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private roomUserService: RoomUserService,
    private messageService: MessageService, //private connectedUsers:   {[userId: number]: Socket}
    private jwtService: JwtService,
    private prisma: DbService,
  ) {}
  
 async handleConnection(socket: Socket) {
    console.log('client connected');
    try {
      const clearToken = await this.jwtService.verifyAsync(socket.handshake.auth.token, {secret: process.env['JWT_SECRET']});
      socket.data.user = await this.prisma.user.findUnique({where: {username: clearToken.username}})
    } catch (error) {
      console.log(error);
    }
    console.log(socket.data.user);
    let rooms = await this.roomService.rooms({});
    if (rooms.length > 0)
      this.server.to(socket.id).emit('rooms', rooms);
    //this.server.to(socket.id).emit('testfgh');
    //console.log(await this.roomService.rooms({}));
  }

  async handleDisconnect(socket: Socket) {

  }

  @SubscribeMessage('createRoom')
  async createRoom(
    socket: Socket,
    room: Room
  ) {
    if (room.roomType === 'PROTECTED' && !room.password) return 'Error';
    await this.roomService.createRoom({
      name: room.name,
      password: room.password,
      roomType: room.roomType,
      //users: { create: { user: { connect: owner }, role: 'OWNER' } },
    });
    // needs emit once i can find how to identify user by connection to server
    // emit new room to all connected user
    //this.server.to(socket.id).emit('rooms', this.roomService.rooms({}));
    this.getRooms(socket);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(socket: Socket, room: Room) {
    console.log(room);
    this.roomService.joinRoom(room, await this.prisma.user.findUnique({where: {username: socket.data.user.username}}));
    // needs emit once i can find how to identify user by connection to server
    // emmit room messages to new member of room
    console.log(room);
    this.getMsgs(socket, room.id);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(socket: Socket, room: Room) {
    this.server.to(socket.id).emit('msgs', []);
  }

  @SubscribeMessage('addMessage')
  async addMessage(socket: Socket, message: string) {
    console.log(socket);
    var parsed = JSON.parse(JSON.stringify(message));
    console.log(parsed.room);
    await this.messageService.createMessage({
      content: parsed.content,
      //room: { connect: message.room },
      room: {connect: {name: parsed.room.name}},
      //roomId: message.roomId,
      user: { connect: {username: socket.data.user.username} },
    });
    // needs emit once i can find how to identify user by connection to server
    // emmit new message to all members of the room
    //await this.roomService.addMessage(room, message);
    //this.server.to(socket.id).emit('rooms', room);
    //this.server.to(socket.id).emit('message', await this.messageService.messages({where: {roomId: parsed.room.roomId}}))
    //console.log(parsed.room.id);
    //parsed.room.messages = await this.messageService.messages({where: {roomId: parsed.room.id}});
    //console.log(parsed.room);
    //this.server.to(socket.id).emit('rooms', [JSON.parse(JSON.stringify(parsed.room))]);
    this.getMsgs(socket, parsed.room.id);
  }

  @SubscribeMessage('getMsgs')
  async getMsgs(socket: Socket, roomId: number) {
    console.log(roomId, await this.messageService.messages({where: {roomId: roomId}}));
    this.server.to(socket.id).emit('msgs', await this.messageService.messages({where: {roomId: roomId}}));
  }

  @SubscribeMessage('getRooms')
  async getRooms(socket: Socket) {
    this.server.to(socket.id).emit('rooms', await this.roomService.rooms({}));
  }
}
