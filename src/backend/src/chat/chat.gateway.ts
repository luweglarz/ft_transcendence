import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomUserService } from './room-user/room-user.service';
import { RoomService } from './room/room.service';
import { MessageService } from './message/message.service';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import { Room } from '@prisma/client';

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
      const clearToken = await this.jwtService.verifyAsync(
        socket.handshake.auth.token,
        { secret: process.env['JWT_SECRET'] },
      );
      if (!clearToken) return;
      socket.data.user = await this.prisma.user.findUnique({
        where: { username: clearToken.username },
      });
    } catch (error) {
      console.log(error);
      socket.disconnect();
    }
    console.log('fgh', socket.data.user);
    const rooms = await this.roomService.rooms({});
    if (rooms.length > 0) this.server.to(socket.id).emit('rooms', rooms);
    //this.server.to(socket.id).emit('testfgh');
    //console.log(await this.roomService.rooms({}));
  }

  async handleDisconnect(socket: Socket) {
    //need cleanup of roomusers
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async createRoom(socket: Socket, room: Room) {
    if (room.roomType === 'PROTECTED' && !room.password) return 'Error';
    await this.roomService.createRoom(room, socket.data.user.id);
    // needs emit once i can find how to identify user by connection to server
    // emit new room to all connected user
    //this.server.to(socket.id).emit('rooms', this.roomService.rooms({}));
    this.getRooms(socket);
    this.getRoomUsers(socket, room.id);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(socket: Socket, room: Room) {
    console.log('joinRoommsg', room);
    console.log(
      'nuser',
      await this.prisma.user.findUnique({
        where: { username: socket.data.user.username },
      }),
    );
    this.roomService.joinRoom(
      room,
      (
        await this.prisma.user.findUnique({
          where: { username: socket.data.user.username },
        })
      ).id,
    );
    // needs emit once i can find how to identify user by connection to server
    // emmit room messages to new member of room
    //console.log(room);
    this.getMsgs(socket, room.id);
    this.getRoomUsers(socket, room.id);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(socket: Socket, room: Room) {
    this.server.to(socket.id).emit('msgs', []);
  }

  @SubscribeMessage('addMessage')
  async addMessage(socket: Socket, message: string) {
    console.log(socket);
    const parsed = JSON.parse(JSON.stringify(message));
    console.log(parsed.room);
    await this.messageService.createMessage({
      content: parsed.content,
      //room: { connect: message.room },
      room: { connect: { name: parsed.room.name } },
      //roomId: message.roomId,
      user: { connect: { username: socket.data.user.username } },
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
    this.getRoomUsers(socket, parsed.room.id);
  }

  @SubscribeMessage('getMsgs')
  async getMsgs(socket: Socket, roomId: number) {
    const messages = JSON.parse(
      JSON.stringify(
        await this.messageService.messages({ where: { roomId: roomId } }),
      ),
    );
    let count = 0;
    for (const roomUser of messages) {
      count++;
    }
    let i = 0;
    while (i < count) {
      messages[i].username = (
        await this.prisma.user.findUnique({ where: { id: messages[i].userId } })
      ).username;
      i++;
    }
    console.log('fgh', messages);
    this.server.to(socket.id).emit('msgs', messages);
  }

  @SubscribeMessage('getRooms')
  async getRooms(socket: Socket) {
    this.server.to(socket.id).emit('rooms', await this.roomService.rooms({}));
  }

  async getRoomUsers(socket: Socket, roomId: number) {
    const roomUsers = JSON.parse(
      JSON.stringify(
        await this.roomUserService.roomUsers({ where: { roomId: roomId } }),
      ),
    );
    let count = 0;
    for (const roomUser of roomUsers) {
      count++;
    }
    let i = 0;
    while (i < count) {
      roomUsers[i].username = (
        await this.prisma.user.findUnique({
          where: { id: roomUsers[i].userId },
        })
      ).username;
      i++;
    }
    console.log('fgh', roomUsers);
    this.server.to(socket.id).emit('roomUsers', roomUsers);
  }
}
