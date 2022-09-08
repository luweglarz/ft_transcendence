import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { RoomUser, Prisma, Role } from '@prisma/client';

@Injectable()
export class RoomUserService {
  constructor(private prisma: DbService) {}

  async roomUser(
    roomUserWhereUniqueInput: Prisma.RoomUserWhereUniqueInput,
  ): Promise<RoomUser | null> {
    return this.prisma.roomUser.findUnique({
      where: roomUserWhereUniqueInput,
    });
  }

  async roomUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoomUserWhereUniqueInput;
    where?: Prisma.RoomUserWhereInput;
    orderBy?: Prisma.RoomUserOrderByWithRelationInput;
  }): Promise<RoomUser[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.roomUser.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createRoomUser(data: Prisma.RoomUserCreateInput): Promise<RoomUser> {
    return this.prisma.roomUser.create({
      data,
    });
  }

  async updateRole(id: number, role: Role) {
    await this.prisma.roomUser.update({
      where: {
        roomUserId: id,
      },
      data: {
        role: role,
      },
    });
  }
}
