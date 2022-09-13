import { Injectable } from '@nestjs/common';
import { RoomUser, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { DbService } from 'src/db/db.service';
import { JailUserService } from '../jail-user/jailUser.service';
import { RoomUserService } from '../room-user/room-user.service';
import { RoomService } from '../room/room.service';

@Injectable()
export class CommandService {
  constructor(
    private roomUserService: RoomUserService,
    private roomService: RoomService,
    private jailUserService: JailUserService,
    private prisma: DbService,
  ) {}

  async exec(command, user: User, connectedUsers: Socket[]): Promise<string> {
    const roomUser = await this.roomUserService.roomUsers({
      where: { roomId: command.id, AND: { userId: user.id } },
    });
    if (roomUser.length != 1) return 'database error';
    console.log(roomUser);
    const splitCmd: string[] = command.command.split(/[ \t\n]+/);
    console.log(splitCmd);
    if (splitCmd.length < 2) return 'incomplete command';
    if (splitCmd[splitCmd.length - 1] === '') splitCmd.pop();
    return await this.cmdSelector(
      splitCmd,
      command,
      roomUser[0],
      connectedUsers,
    );
  }

  async cmdSelector(
    splitCmd: string[],
    command,
    roomUser: RoomUser,
    connectedUsers: Socket[],
  ): Promise<string> {
    if (splitCmd[0] === '/admin') {
      return await this.admin(splitCmd, command, roomUser);
    } else if (splitCmd[0] === '/deadmin') {
      return await this.deadmin(splitCmd, command, roomUser);
    } else if (splitCmd[0] === '/password') {
      return await this.password(splitCmd, command, roomUser);
    } else if (splitCmd[0] === '/mute' || splitCmd[0] === '/ban') {
      return this.banOrMute(splitCmd, command, roomUser);
    } else if (splitCmd[0] === '/invite') {
      return this.invite(splitCmd, command, roomUser, connectedUsers);
    } else if (splitCmd[0] === '/challenge') {
      return this.challenge(splitCmd, command, roomUser);
    } else if (splitCmd[0] === '/whisper' || splitCmd[0] === '/w') {
      return this.whisper(splitCmd, command, roomUser);
    } else {
      return 'command not found';
    }
  }

  async admin(
    splitCmd: string[],
    command,
    roomUser: RoomUser,
  ): Promise<string> {
    if (roomUser.role === 'USER' || roomUser.role === 'ADMIN')
      return "you don't have the right";
    const targetUser = await this.prisma.user.findUnique({
      where: { username: splitCmd[1] },
    });
    console.log(targetUser);
    if (targetUser === null) return 'no such user';
    const targetRoomUser = await this.roomUserService.roomUsers({
      where: { roomId: command.id, AND: { userId: targetUser.id } },
    });
    console.log(targetRoomUser);
    if (targetRoomUser.length === 0) return 'user is not in the room';
    if (targetRoomUser.length !== 1) return 'database error';
    console.log('just before the update');
    if (targetRoomUser[0].role === 'USER') {
      await this.roomUserService.updateRole(
        targetRoomUser[0].roomUserId,
        'ADMIN',
      );
      return (
        (
          await this.prisma.user.findUnique({
            where: { id: targetRoomUser[0].userId },
          })
        ).username + ' is now an admin'
      );
    }
    return (
      (
        await this.prisma.user.findUnique({
          where: { id: targetRoomUser[0].userId },
        })
      ).username + ' is already an admin'
    );
  }

  async deadmin(
    splitCmd: string[],
    command,
    roomUser: RoomUser,
  ): Promise<string> {
    if (roomUser.role === 'USER' || roomUser.role === 'ADMIN')
      return "you don't have the right";
    const targetUser = await this.prisma.user.findUnique({
      where: { username: splitCmd[1] },
    });
    console.log(targetUser);
    if (targetUser === null) return 'no such user';
    const targetRoomUser = await this.roomUserService.roomUsers({
      where: { roomId: command.id, AND: { userId: targetUser.id } },
    });
    console.log(targetRoomUser);
    if (targetRoomUser.length === 0) return 'user is not in the room';
    if (targetRoomUser.length !== 1) return 'database error';
    console.log('just before the update');
    if (targetRoomUser[0].role === 'ADMIN') {
      await this.roomUserService.updateRole(
        targetRoomUser[0].roomUserId,
        'USER',
      );
      return (
        (
          await this.prisma.user.findUnique({
            where: { id: targetRoomUser[0].userId },
          })
        ).username + ' is now a user'
      );
    }
    return (
      (
        await this.prisma.user.findUnique({
          where: { id: targetRoomUser[0].userId },
        })
      ).username + ' is already a user'
    );
  }

  async password(
    splitCmd: string[],
    command,
    roomUser: RoomUser,
  ): Promise<string> {
    if (roomUser.role !== 'OWNER') return "you don't have the right";
    console.log('after check owner');
    if (splitCmd.length === 1) return 'incomplete command';
    console.log('after check length');
    const room = await this.roomService.room({ id: command.id });
    if (room === undefined) return 'database error';
    if (room.roomType !== 'PROTECTED') return 'not a protected room';
    console.log('after check room');
    if (splitCmd[1] === 'remove') {
      await this.roomService.removePassword(room);
      return 'this room is now public';
    } else if (splitCmd[1] === 'change') {
      if (splitCmd.length !== 3) return 'new password is missing';
      await this.roomService.updatePassword(room, splitCmd[2]);
      return 'password updated';
    }
    return 'usage /password (remove ^ (change new_password))';
  }

  async banOrMute(
    splitCmd: string[],
    command,
    roomUser: RoomUser,
  ): Promise<string> {
    if (roomUser.role === 'USER') return "you don't have the right";
    if (splitCmd.length > 3) return 'usage: /(ban ^ mute) username time?';
    if (splitCmd.length === 1) return 'incomplete command';
    const room = await this.roomService.room({ id: command.id });
    if (room === undefined) return 'database error';
    let timeOut = 0;
    const targetUser = await this.prisma.user.findUnique({
      where: { username: splitCmd[1] },
    });
    if (targetUser === null) return 'not a user';
    const targetRoomUser: RoomUser[] = await this.roomUserService.roomUsers({
      where: { roomId: command.id, AND: { userId: targetUser.id } },
    }); // get targetUser
    if (targetRoomUser.length === 0) return 'user is not in the room';
    if (targetRoomUser.length !== 1) return 'database error';
    if (targetRoomUser[0].role !== 'USER')
      return 'you cannot ban an owner or an admin';
    if (
      (await this.jailUserService.getUser(targetUser.id, command.id)) !== null
    )
      return 'user is already banned or muted';
    if (splitCmd.length === 3) {
      timeOut = +splitCmd[2];
      if (isNaN(timeOut)) return 'enter a number';
      if (timeOut < 1) return 'enter a positive value greater than 0';
      console.log(timeOut);
    }
    await this.jailUserService.banOrMuteUser(
      targetRoomUser[0].userId,
      command.id,
      splitCmd[0] === '/ban',
      timeOut,
    );
    return splitCmd[0] === '/ban'
      ? 'banned ' + splitCmd[1]
      : 'muted ' + splitCmd[1];
  }

  async invite(
    splitCmd: string[],
    command,
    roomUser: RoomUser,
    connectedUsers: Socket[],
  ): Promise<string> {
    if (roomUser.role === 'USER') return "you don't have the right";
    if (splitCmd.length > 2) return 'usage ' + splitCmd[0] + ' USERNAME';
    if (splitCmd.length < 2) return 'incomplete command';
    const room = await this.roomService.room({ id: command.id });
    if (room === undefined) return 'database error';
    const targetUser = await this.prisma.user.findUnique({
      where: { username: splitCmd[1] },
    });
    if (targetUser === null) return 'not a user';
    const targetRoomUser: RoomUser[] = await this.roomUserService.roomUsers({
      where: { roomId: command.id, AND: { userId: targetUser.id } },
    });
    if (targetRoomUser.length === 1) return 'user is already in the room';
    if (targetRoomUser.length > 1) return 'database error';
    for (const connectedUser of connectedUsers) {
      if (
        connectedUser !== undefined &&
        connectedUser.connected === true &&
        targetUser.username === connectedUser.data.user.username
      ) {
        return (
          splitCmd[0] +
          ' ' +
          targetUser.id +
          ' ' +
          targetUser.username +
          ' ' +
          connectedUser.id
        );
      }
    }
    return 'user is not in chat';
  }

  async challenge(
    splitCmd: string[],
    command,
    roomUser: RoomUser,
  ): Promise<string> {
    if (splitCmd.length > 2) return 'usage ' + splitCmd[0] + ' USERNAME';
    if (splitCmd.length < 2) return 'incomplete command';
    const targetUser = await this.prisma.user.findUnique({
      where: { username: splitCmd[1] },
    });
    if (targetUser === null) return 'not a user';
    if (targetUser.id === roomUser.userId) return 'cannot challenge yourself';
    const targetRoomUser: RoomUser[] = await this.roomUserService.roomUsers({
      where: { roomId: command.id, AND: { userId: targetUser.id } },
    });
    if (targetRoomUser.length < 1) return 'user is not in the room';
    if (targetRoomUser.length > 1) return 'database error';
    return (splitCmd[0] +
      ' ' +
      targetUser.id +
      ' ' +
      targetUser.username +
      ' ' +
      targetRoomUser[0].socketId);
  }

  async whisper(
    splitCmd: string[],
    command,
    roomUser: RoomUser,
  ): Promise<string> {
    const targetUser = await this.prisma.user.findUnique({
      where: { username: splitCmd[1] },
    });
    if (targetUser === null) return 'not a user';
    if (targetUser.id === roomUser.userId) return 'cannot dm yourself';
    const targetRoomUser: RoomUser[] = await this.roomUserService.roomUsers({
      where: { roomId: command.id, AND: { userId: targetUser.id } },
    });
    if (targetRoomUser.length < 1) return 'user is not in the room';
    if (targetRoomUser.length > 1) return 'database error';
    for (let i = 3; i < splitCmd.length; i++) {
      splitCmd[2] = splitCmd[2] + ' ' + splitCmd[i];
    }
    console.log(splitCmd[2]);
    return (
      splitCmd[0] +
      ' ' +
      targetUser.id +
      ' ' +
      targetUser.username +
      ' ' +
      targetRoomUser[0].socketId +
      ' ' +
      splitCmd[2]
    );
  }
}
/*
+ ban 2
+ mute 2
+ password 0
+ admin 0
+ deadmin 1 
- leave 2
+ invite 3
+ challenge 4
*/
