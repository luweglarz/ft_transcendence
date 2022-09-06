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
import { DbService } from 'src/db/db.service';
import { Invite, JailUser, Room, RoomUser } from '@prisma/client';
import { Logger, OnModuleInit } from '@nestjs/common';
import * as argon from 'argon2';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { CommandService } from './command/command.service';
import { JailUserService } from './jail-user/jailUser.service';

@WebSocketGateway({ cors: true, path: '/chat' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers: Socket[] = [];

  constructor(
    private roomService: RoomService,
    private roomUserService: RoomUserService,
    private messageService: MessageService, //private connectedUsers:   {[userId: number]: Socket}
    private jwt: JwtAuthService,
    private prisma: DbService,
    private commandService: CommandService,
    private jailUserService: JailUserService,
  ) {}

  onModuleInit() {
    this.connectedUsers = [];
    this.connectedUsers.length = 0;
  }

  async handleConnection(socket: Socket) {
    console.log('client connected');
    try {
      const clearToken = await this.jwt.verifyAccessToken(
        socket.handshake.auth.token,
      );
      this.logger.debug('why tho', clearToken);
      if (!clearToken) return;
      socket.data.user = await this.prisma.user.findUnique({
        where: { username: clearToken.username },
      });
    } catch (error) {
      this.logger.error(error);
      socket.disconnect();
      return;
    }
    if (socket.data.user == null) {
      socket.disconnect();
      return;
    }
    //const rooms = await this.roomService.rooms({});
    this.connectedUsers.push(socket);
    //if (rooms.length > 0) this.server.to(socket.id).emit('rooms', rooms);
    this.getRooms();
    //this.server.to(socket.id).emit('testfgh');
    //console.log(await this.roomService.rooms({}));
  }

  async handleDisconnect(socket: Socket) {
    //need cleanup of roomusers
    this.logger.debug(socket.id);
    //delete this.connectedUsers[socket.id];
    let i = 0;
    for (const connectedUser of this.connectedUsers) {
      if (
        connectedUser !== undefined &&
        (connectedUser.id === socket.id || connectedUser.connected === false)
      )
        delete this.connectedUsers[i];
      i++;
    }
    //await this.prisma.roomUser.deleteMany({where: {socketId: socket.id}});
    const roomUsers = await this.roomUserService.roomUsers({
      where: { socketId: socket.id },
    });
    for (const roomUser of roomUsers) {
      this.logger.debug('in handle disco', roomUser);
      const otherRoomUser = await this.roomUserService.roomUsers({
        where: { roomId: roomUser.roomId },
      });
      this.logger.debug('otherroomuser', otherRoomUser.length);
      if (otherRoomUser.length == 1) {
        await this.prisma.message.deleteMany({
          where: { roomId: roomUser.roomId },
        });
        await this.prisma.roomUser.delete({
          where: { roomUserId: roomUser.roomUserId },
        });
        await this.prisma.jailUser.deleteMany({
          where: { roomId: roomUser.roomId },
        });
        await this.prisma.invite.deleteMany({
          where: { roomId: roomUser.roomId },
        });
        await this.prisma.room.delete({ where: { id: roomUser.roomId } });
      }
      if (
        await this.roomUserService.roomUser({ roomUserId: roomUser.roomUserId })
      )
        await this.prisma.roomUser.delete({
          where: { roomUserId: roomUser.roomUserId },
        });
      this.getRoomUsers(roomUser.roomId);
    }
    await this.prisma.roomUser.deleteMany({ where: { socketId: socket.id } });
    await this.getRooms();
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async createRoom(socket: Socket, room: Room) {
    if (room.roomType === 'PROTECTED' && !room.password) return 'Error';
    if (room.roomType === 'PROTECTED') {
      room.password = await argon.hash(room.password);
    }
    const nr = await this.roomService.createRoom(
      room,
      socket.data.user.id,
      socket.id,
    );
    if (nr.roomType === 'PROTECTED') nr.password = '';
    // needs emit once i can find how to identify user by connection to server
    // emit new room to all connected user
    //this.server.to(socket.id).emit('rooms', this.roomService.rooms({}));
    //await this.getRooms(socket);
    await this.getRooms();
    this.server.to(socket.id).emit('createdRoom', nr);
    await this.getRoomUsers(room.id);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(socket: Socket, room: Room) {
    console.log('joinRoommsg', room);
    const user = await this.prisma.user.findUnique({
      where: { username: socket.data.user.username },
    });
    this.logger.debug(
      `${user.username} is trying to join room ${room.id}:${room.name}`,
    );
    const findusers = await this.roomUserService.roomUsers({
      where: { roomId: room.id },
    });
    for (const finduser of findusers) {
      if (finduser.userId === user.id) {
        this.getMsgs(socket, room.id);
        this.getRoomUsers(room.id);
      }
    }
    try {
      if (
        room.roomType === 'PROTECTED' &&
        (await argon.verify(
          (
            await this.roomService.room({ id: room.id })
          ).password,
          room.password,
        ))
      ) {
        await this.roomService.joinRoom(room, user.id, socket.id);
        this.getMsgs(socket, room.id);
        this.getRoomUsers(room.id);
      } else if (room.roomType !== 'PROTECTED') {
        await this.roomService.joinRoom(room, user.id, socket.id);
        this.getMsgs(socket, room.id);
        this.getRoomUsers(room.id);
      }
    } catch (error) {
      this.logger.error(error);
    }
    await this.prisma.invite.deleteMany({
      where: {
        roomId: room.id,
        AND: { challenge: false, targetuserId: user.id },
      },
    });
    // needs emit once i can find how to identify user by connection to server
    // emmit room messages to new member of room
    //console.log(room);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(socket: Socket, room: Room) {
    this.logger.debug(room);
    const roomUsers = await this.roomUserService.roomUsers({
      where: { socketId: socket.id, roomId: room.id },
    });
    for (const roomUser of roomUsers) {
      this.logger.debug('in handle disco', roomUser);
      const otherRoomUser = await this.roomUserService.roomUsers({
        where: { roomId: roomUser.roomId },
      });
      this.logger.debug('otherroomuser', otherRoomUser.length);
      if (otherRoomUser.length == 1) {
        await this.prisma.message.deleteMany({
          where: { roomId: roomUser.roomId },
        });
        await this.prisma.roomUser.delete({
          where: { roomUserId: roomUser.roomUserId },
        });
        await this.prisma.jailUser.deleteMany({
          where: { roomId: roomUser.roomId },
        });
        await this.prisma.invite.deleteMany({
          where: { roomId: roomUser.roomId },
        });
        await this.prisma.room.delete({ where: { id: roomUser.roomId } });
      }
    }
    await this.prisma.roomUser.deleteMany({
      where: { socketId: socket.id, roomId: room.id },
    });
    /*let roomUsers = await this.roomUserService.roomUsers({where: {userId: socket.data.user.id}});
    for (let roomUser of roomUsers) {
      this.logger.debug(roomUser);
      if (roomUser.roomId == room.id)
      this.logger.debug('inif', roomUser);
    }*/
    this.server.to(socket.id).emit('msgs', []);
    this.server.to(socket.id).emit('roomUsers', []);
    await this.getRooms();
    await this.getRoomUsers(room.id);
  }

  @SubscribeMessage('addMessage')
  async addMessage(socket: Socket, message: string) {
    console.log(socket);
    const parsed = JSON.parse(JSON.stringify(message));
    console.log(parsed);
    const finduser = await this.roomUserService.roomUsers({
      where: { roomId: parsed.room.id, socketId: socket.id },
    });
    if (finduser.length < 1) return;
    if (
      (await this.jailUserService.getUser(
        finduser[0].userId,
        parsed.room.id,
      )) !== null
    )
      return;
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
    this.getRoomUsers(parsed.room.id);
  }

  @SubscribeMessage('command')
  async command(socket: Socket, command) {
    this.logger.debug(command);
    const resultCmd: string = await this.commandService.exec(
      command,
      socket.data.user,
      this.connectedUsers,
    );
    this.logger.debug(resultCmd);
    const splitRet: string[] = resultCmd.split(/[ ]/);
    if (splitRet[0] !== '/invite')
      this.server.to(socket.id).emit('resultCommand', resultCmd);
    else
      this.server.to(socket.id).emit('resultCommand', 'invited ' + splitRet[2]);
    if (
      splitRet.length === 2 &&
      (splitRet[0] === 'banned' || splitRet[0] === 'muted')
    ) {
      const jailUsers: RoomUser[] = await this.roomUserService.roomUsers({
        where: {
          userId: (
            await this.prisma.user.findUnique({
              where: { username: splitRet[1] },
            })
          ).id,
          AND: {
            roomId: command.id,
          },
        },
      });
      console.log(jailUsers);
      if (jailUsers.length === 1) {
        this.server
          .to(jailUsers[0].socketId)
          .emit('banMute', 'you are ' + splitRet[0]);
      }
    } else if (splitRet[0] === '/invite') {
      const invite: Invite = await this.prisma.invite.create({
        data: {
          userId: socket.data.user.id,
          username: socket.data.user.username,
          targetuserId: +splitRet[1],
          roomId: command.id,
          challenge: false,
        },
      });
      console.log(this.connectedUsers.length);
      this.server.to(splitRet[3]).emit('invitation', {
        invite,
        Room: await this.roomService.room({ id: command.id }),
      });
    }
  }

  @SubscribeMessage('getMsgs')
  async getMsgs(socket: Socket, roomId: number) {
    const messages = JSON.parse(
      JSON.stringify(
        await this.messageService.messages({ where: { roomId: roomId } }),
      ),
    );
    // let count = 0;
    // for (const roomUser of messages) {
    //   count++;
    // }
    const count = messages.length;
    let i = 0;
    while (i < count) {
      messages[i].username = (
        await this.prisma.user.findUnique({ where: { id: messages[i].userId } })
      ).username;
      i++;
    }
    console.log('fgh', messages);
    const roomUsers = await this.roomUserService.roomUsers({
      where: { roomId: roomId },
    });
    const jailUsers: JailUser[] = await this.jailUserService.jailUsers({
      where: { roomId: roomId, AND: { isBanned: true } },
    });
    let j = 0;
    for (const jailUser of jailUsers) {
      j = 0;
      for (const roomUser of roomUsers) {
        if (roomUser.userId === jailUser.userId) {
          delete roomUsers[j];
        }
        j++;
      }
    }
    for (const roomuser of roomUsers) {
      if (roomuser !== undefined)
        this.server.to(roomuser.socketId).emit('msgs', messages);
    }
    //this.server.to(socket.id).emit('msgs', messages);
  }

  @SubscribeMessage('getRooms')
  async getRooms() {
    //this.server.to(socket.id).emit('rooms', await this.roomService.rooms({}));
    const rooms = await this.roomService.rooms({});
    const roomsNoPRV: Room[] = [];
    for (const room of rooms) {
      console.log('roomBefor', room);
    }
    for (const room of rooms) {
      console.log('room', room);
      if (room.roomType !== 'PRIVATE') roomsNoPRV.push(room);
    }
    for (const room of roomsNoPRV) {
      if (room.roomType == 'PROTECTED') room.password = '';
    }
    for (const connectedUser of this.connectedUsers) {
      if (connectedUser !== undefined)
        this.server.to(connectedUser.id).emit('rooms', roomsNoPRV);
    }
  }

  async getRoomUsers(roomId: number) {
    const roomUsers = JSON.parse(
      JSON.stringify(
        await this.roomUserService.roomUsers({ where: { roomId: roomId } }),
      ),
    );
    const count = roomUsers.length;
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
    //this.server.to(socket.id).emit('roomUsers', roomUsers);
    for (const roomUser of roomUsers) {
      this.server.to(roomUser.socketId).emit('roomUsers', roomUsers);
    }
  }
}
