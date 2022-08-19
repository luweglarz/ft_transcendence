import { Injectable, Logger } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Room, Prisma, Message, JailUser } from '@prisma/client';
import { RoomService } from '../room/room.service';

@Injectable()
export class JailUserService {
  private readonly logger = new Logger(JailUserService.name);

  constructor(private prisma: DbService, private roomService: RoomService) {}

  async jailUser(
    jailUserWhereUniqueInput: Prisma.JailUserWhereUniqueInput,
  ): Promise<JailUser | null> {
    return this.prisma.jailUser.findUnique({
      where: jailUserWhereUniqueInput,
    });
  }

  async jailUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.JailUserWhereUniqueInput;
    where?: Prisma.JailUserWhereInput;
    orderBy?: Prisma.JailUserOrderByWithRelationInput;
  }): Promise<JailUser[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.jailUser.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createJailUser(data: Prisma.JailUserCreateInput): Promise<JailUser> {
    return this.prisma.jailUser.create({
      data,
    });
  }

  async deleteJailUser(jailUserId: number, roomId: number, userId: number) {
    console.log('delete jail user has been called');
    let ju: number[] = (await this.roomService.room({id: roomId})).jailUsers;
    await this.prisma.room.update({where: {id: roomId}, data: {jailUsers: {set: ju.filter((id: number) => id !== userId)}}});
    await this.prisma.jailUser.delete({where: {id: jailUserId}});
  }

  async banOrMuteUser(userId: number, roomId: number, banOrMute: boolean ,timeOut: number) {
    await this.prisma.room.update({where: {id: roomId}, data: {jailUsers: {push: userId}}});
    let data = {userId: userId, roomId: roomId, isBanned: false, isMuted: false};
    if (banOrMute === true) {
        data.isBanned = true;
    } else {
        data.isMuted = true;
    }
    let jailUser: JailUser = await this.createJailUser(data);
    if (timeOut !== 0) {
        setTimeout(() => {this.deleteJailUser(jailUser.id, roomId, userId);}, timeOut * 1000);
    }
  }

  async getUser(userId: number, roomId: number): Promise<JailUser | null> {
    let users: JailUser[] = await this.jailUsers({where: {userId: userId, AND: {roomId: roomId}}});
    if (users.length !== 1)
        return (null);
    return (users[0]);
  }

}