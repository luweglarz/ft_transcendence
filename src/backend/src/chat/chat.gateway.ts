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
import { OnModuleInit } from '@nestjs/common';
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
    try {
      const clearToken = await this.jwt.verifyAccessToken(
        socket.handshake.auth.token,
      );
      if (!clearToken) return;
      socket.data.user = await this.prisma.user.findUnique({
        where: { username: clearToken.username },
      });
    } catch (error) {
      socket.disconnect();
      return;
    }
    if (socket.data.user == null) {
      socket.disconnect();
      return;
    }
    this.connectedUsers.push(socket);
    this.getRooms();
  }

  async handleDisconnect(socket: Socket) {
    let i = 0;
    for (const connectedUser of this.connectedUsers) {
      if (
        connectedUser !== undefined &&
        (connectedUser.id === socket.id || connectedUser.connected === false)
      )
        delete this.connectedUsers[i];
      i++;
    }
    const roomUsers = await this.roomUserService.roomUsers({
      where: { socketId: socket.id },
    });
    for (const roomUser of roomUsers) {
      const otherRoomUser = await this.roomUserService.roomUsers({
        where: { roomId: roomUser.roomId },
      });
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
    await this.getRooms();
    this.server.to(socket.id).emit('createdRoom', nr);
    await this.getRoomUsers(room.id);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(socket: Socket, room: Room) {
    const user = await this.prisma.user.findUnique({
      where: { username: socket.data.user.username },
    });
    const findusers = await this.roomUserService.roomUsers({
      where: { roomId: room.id },
    });

    /* Mon code pour empecher la connexion si l'user fais partie des jailUsers */
    const jailUsers: JailUser[] = await this.jailUserService.jailUsers({
      where: { roomId: room.id, AND: { isBanned: true } },
    });
    for (const jailUser of jailUsers) {
      if (user.id === jailUser.userId){
        this.server.to(socket.id).emit('kickLeave');
        this.server.to(socket.id).emit('banMute', 'you were banned');
        return;
      }
    }

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
    } catch (error) {}
    await this.prisma.invite.deleteMany({
      where: {
        roomId: room.id,
        AND: { challenge: false, targetuserId: user.id },
      },
    });
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(socket: Socket, room: Room) {
    const roomUsers = await this.roomUserService.roomUsers({
      where: { socketId: socket.id, roomId: room.id },
    });
    for (const roomUser of roomUsers) {
      const otherRoomUser = await this.roomUserService.roomUsers({
        where: { roomId: roomUser.roomId },
      });
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
    this.server.to(socket.id).emit('msgs', []);
    this.server.to(socket.id).emit('roomUsers', []);
    await this.getRooms();
    await this.getRoomUsers(room.id);
  }

  async leaveRoomById(socketId: string, room: Room) {
    const roomUsers = await this.roomUserService.roomUsers({
      where: { socketId: socketId, roomId: room.id },
    });
    for (const roomUser of roomUsers) {
      const otherRoomUser = await this.roomUserService.roomUsers({
        where: { roomId: roomUser.roomId },
      });
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
      where: { socketId: socketId, roomId: room.id },
    });
    this.server.to(socketId).emit('msgs', []);
    this.server.to(socketId).emit('roomUsers', []);
    await this.getRooms();
    await this.getRoomUsers(room.id);
  }

  @SubscribeMessage('addMessage')
  async addMessage(socket: Socket, message: string) {
    const parsed = JSON.parse(JSON.stringify(message));
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
    const nMessage: any = await this.messageService.createMessage({
      content: parsed.content,
      room: { connect: { name: parsed.room.name } },
      user: { connect: { username: socket.data.user.username } },
    });
    const roomUsers = await this.roomUserService.roomUsers({
      where: { roomId: parsed.room.id },
    });
    nMessage.username = socket.data.user.username;
    for (const roomUser of roomUsers) {
      this.server.to(roomUser.socketId).emit('msg', nMessage);
    }
    this.getMsgs(socket, parsed.room.id);
    this.getRoomUsers(parsed.room.id);
  }

  @SubscribeMessage('command')
  async command(socket: Socket, command) {
    const resultCmd: string = await this.commandService.exec(
      command,
      socket.data.user,
      this.connectedUsers,
    );
    const splitRet: string[] = resultCmd.split(/[ ]/);
    if (splitRet[0] === '/invite')
      this.server.to(socket.id).emit('resultCommand', 'invited ' + splitRet[2]);
    else if (splitRet[0] === '/challenge')
      this.server
        .to(socket.id)
        .emit('resultCommand', 'challenged ' + splitRet[2]);
    else if (splitRet[0] === '/w' || splitRet[0] === '/whisper')
      this.server
        .to(socket.id)
        .emit('resultCommand', 'whispered to ' + splitRet[2]);
    else if (splitRet[0] === '/leave')
      this.server.to(socket.id).emit('resultCommand', 'room leaved');
    else if (splitRet[0] === '/kick')
      this.server.to(socket.id).emit('resultCommand', 'kicked ' + splitRet[2]);
    else this.server.to(socket.id).emit('resultCommand', resultCmd);
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
      if (jailUsers.length === 1) {
        this.server
          .to(jailUsers[0].socketId)
          .emit('banMute', 'you are ' + splitRet[0]);
          await this.leaveRoomById(jailUsers[0].socketId, command);
          this.server.to(jailUsers[0].socketId).emit('kickLeave');
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
      this.server.to(splitRet[3]).emit('invitation', {
        invite,
        Room: await this.roomService.room({ id: command.id }),
      });
    } else if (splitRet[0] === '/challenge') {
      const invite: Invite = await this.prisma.invite.create({
        data: {
          userId: socket.data.user.id,
          username: socket.data.user.username,
          targetuserId: +splitRet[1],
          roomId: command.id,
          challenge: true,
        },
      });
      this.server.to(splitRet[3]).emit('invitation', {
        invite,
        Room: await this.roomService.room({ id: command.id }),
      });
    } else if (splitRet[0] === '/w' || splitRet[0] === '/whisper') {
      for (let i = 5; i < splitRet.length; i++) {
        splitRet[4] = splitRet[4] + ' ' + splitRet[i];
      }
      const dm = {
        userId: socket.data.user.id,
        username: socket.data.user.username,
        targetUserId: +splitRet[1],
        content: splitRet[4],
        createdAt: new Date(Date.now()),
        dm: true,
        targetUsernameDm: splitRet[2],
      };
      this.server.to(splitRet[3]).emit('msg', dm);
      this.server.to(socket.id).emit('msg', dm);
    } else if (splitRet[0] === '/leave') {
      await this.leaveRoom(socket, command);
      this.server.to(socket.id).emit('kickLeave');
    } else if (splitRet[0] === '/kick') {
      await this.leaveRoomById(splitRet[1], command);
      this.server.to(splitRet[1]).emit('kickLeave');
    }
  }

  @SubscribeMessage('getMsgs')
  async getMsgs(socket: Socket, roomId: number) {
    const messages = JSON.parse(
      JSON.stringify(
        await this.messageService.messages({ where: { roomId: roomId } }),
      ),
    );
    const count = messages.length;
    let i = 0;
    while (i < count) {
      messages[i].username = (
        await this.prisma.user.findUnique({ where: { id: messages[i].userId } })
      ).username;
      i++;
    }
    const roomUsers = await this.roomUserService.roomUsers({
      where: { roomId: roomId },
    });
    const jailUsers: JailUser[] = await this.jailUserService.jailUsers({
      where: { roomId: roomId, AND: { isBanned: true } },
    });


    try {
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
    } catch (error) {
      error;
    }


    for (const roomuser of roomUsers) {
      if (roomuser !== undefined)
        this.server.to(roomuser.socketId).emit('msgs', messages);
    }
  }

  @SubscribeMessage('getRooms')
  async getRooms() {
    const rooms = await this.roomService.rooms({});
    const roomsNoPRV: Room[] = [];
    for (const room of rooms) {
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

  @SubscribeMessage('inviteRemove')
  async inviteRemove(socket: Socket, inviteId: number) {
    if (inviteId === undefined) return;
    await this.prisma.invite.delete({ where: { id: inviteId } });
  }

  @SubscribeMessage('roomNameAvailable')
  async roomNameAvailable(socket: Socket, roomName: string) {
    if (!roomName) return;
    if (
      (await this.roomService.rooms({ where: { name: roomName } })).length > 0
    ) {
      this.server.to(socket.id).emit('roomNameAvailable', false);
      return;
    }
    this.server.to(socket.id).emit('roomNameAvailable', true);
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
    for (const roomUser of roomUsers) {
      this.server.to(roomUser.socketId).emit('roomUsers', roomUsers);
    }
  }
}
