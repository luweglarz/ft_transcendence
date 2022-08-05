import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { DbErrorCode } from 'src/db/errors';
import { DbService } from 'src/db/db.service';
import { JwtPayload } from '../jwt/interfaces';
import { Prisma, User } from '@prisma/client';
import { JwtAuthService } from '../jwt/jwt-auth.service';

@Injectable()
export class AuthUtilsService {
  private readonly logger = new Logger(AuthUtilsService.name);

  constructor(private db: DbService, private jwt: JwtAuthService) {}

  /*
   * @brief Return a signed token. To be called after the sign in checks were successful
   */
  async signInSuccess(user: User) {
    this.logger.log(`User '${user.username}' successfully signed in!`);
    return {
      message: `${user.username} successfully signed in!`,
      jwt: await this.jwt.signToken(<JwtPayload>{
        sub: user.id,
        username: user.username,
      }),
    };
  }

  async alreadyExists(field: string, value: string) {
    const exists = await this.db.user.findFirst({ where: { [field]: value } });
    return exists ? true : false;
  }

  async createUser(data: Prisma.UserCreateInput) {
    try {
      const user = await this.db.user.create({ data: data });
      this.logger.log(`New user '${data.username}' successfully signed up!`);
      return user;
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
