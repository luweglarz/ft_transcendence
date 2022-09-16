import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtUser } from 'src/auth/modules/jwt/dto';
import { DbService } from 'src/db/db.service';
import { DbErrorCode } from 'src/db/errors';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private db: DbService) {}

  async listUsers() {
    const users = await this.db.user.findMany({ select: { username: true } });
    return users.map((user) => user.username);
  }

  async updateUsername(user: JwtUser, username: string) {
    try {
      const updatedUser = await this.db.user.update({
        data: { username: username },
        where: { id: user.sub },
      });
      this.logger.log(
        `User '${user.username}' has a new username: '${username}'!`,
      );
      return updatedUser;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code == DbErrorCode.UniqueConstraintFailed
      )
        throw new ForbiddenException('User already exists');
      else throw err;
    }
  }
}
