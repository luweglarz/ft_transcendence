import { Injectable } from '@nestjs/common';
import { RoomUser, User } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { RoomUserService } from '../room-user/room-user.service';
import { RoomService } from '../room/room.service';

@Injectable()
export class CommandService {
  constructor(
    private roomUserService: RoomUserService,
    private roomService: RoomService,
    private prisma: DbService,
  ) {}

  async exec(command, user: User): Promise<string> {
    const roomUser = await this.roomUserService.roomUsers({
      where: { roomId: command.id, AND: { userId: user.id } },
    });
    if (roomUser.length != 1) return 'database error';
    console.log(roomUser);
    const splitCmd: string[] = command.command.split(/[ \t\n]+/);
    console.log(splitCmd);
    if (splitCmd.length < 2) return 'incomplete command';
    return await this.cmdSelector(splitCmd, command, roomUser[0]);
  }

  async cmdSelector(
    splitCmd: string[],
    command,
    roomUser: RoomUser,
  ): Promise<string> {
    if (splitCmd[0] === '/admin') {
      return await this.admin(splitCmd, command, roomUser);
    } else if (splitCmd[0] === '/deadmin') {
      return await this.deadmin(splitCmd, command, roomUser);
    } else if (splitCmd[0] === '/password') {
      return await this.password(splitCmd, command, roomUser);
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
    if (targetRoomUser.length != 1) return 'database error';
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
    if (targetRoomUser.length != 1) return 'database error';
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
    return 'usage /password (remove | (change new_password))';
  }
}
/*
- ban 2
- mute 2
+ password 0
+ admin 0
+ deadmin 1
- invite 3
- challenge 4
*/
