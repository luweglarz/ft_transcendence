import { Injectable, Logger } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Room, Prisma, Message } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(private prisma: DbService) {}

  async room(
    roomWhereUniqueInput: Prisma.RoomWhereUniqueInput,
  ): Promise<Room | null> {
    return this.prisma.room.findUnique({
      where: roomWhereUniqueInput,
    });
  }

  async rooms(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoomWhereUniqueInput;
    where?: Prisma.RoomWhereInput;
    orderBy?: Prisma.RoomOrderByWithRelationInput;
  }): Promise<Room[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.room.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createRoom(
    room: Room,
    userId: number,
    socketId: string,
  ): Promise<Room> {
    return await this.prisma.room.create({
      data: {
        name: room.name,
        password: room.password,
        roomType: room.roomType,
        users: {
          create: [
            {
              user: { connect: { id: userId } },
              role: 'OWNER',
              socketId: socketId,
            },
          ],
        },
      },
    });
  }

  async joinRoom(room: Room, userId: number, socketId: string) {
    const existingRoomUser = await this.prisma.roomUser.findFirst({
      where: { roomId: room.id, userId: userId },
    });
    if (existingRoomUser) {
      this.logger.debug(
        `user ${userId} already in room ${room.name}:${room.id}`,
      );
    } else {
      return this.prisma.roomUser.create({
        data: {
          user: { connect: { id: userId } },
          role: 'USER',
          room: { connect: { id: room.id } },
          socketId: socketId,
        },
      });
    }
  }

  async addMessage(room: Room, nMessage: Message) {
    this.prisma.room.update({
      where: {
        name: room.name,
      },
      data: {
        messages: {
          connect: nMessage,
        },
      },
    });
  }

  async removePassword(room: Room) {
    await this.prisma.room.update({
      where: {
          id: room.id,
      },
      data: {
          roomType: 'PUBLIC',
          password: null,
      },
    });
  }

  async updatePassword(room: Room, nPassword: string) {
    await this.prisma.room.update({
      where: {
          id: room.id,
      },
      data: {
          password: await argon.hash(nPassword),
      },
    });
  }
}
