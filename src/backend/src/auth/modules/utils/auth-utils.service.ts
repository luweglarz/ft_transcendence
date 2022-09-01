import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { DbErrorCode } from 'src/db/errors';
import { DbService } from 'src/db/db.service';
import { Prisma } from '@prisma/client';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { SignInSuccessDto, SignInPartialDto } from './dto';
import { TwoFactorsService } from '../two-factors/two-factors.service';

@Injectable()
export class AuthUtilsService {
  private readonly logger = new Logger(AuthUtilsService.name);

  constructor(
    private db: DbService,
    private jwt: JwtAuthService,
    private twoFactors: TwoFactorsService,
  ) {}

  /*
   * @brief Return a signed token. To be called after the sign in checks were successful
   */
  async signInSuccess(
    user: {
      id: number;
      username: string;
    },
    step: '1FA' | '2FA' = '1FA',
  ): Promise<SignInSuccessDto | SignInPartialDto> {
    if (step == '2FA' || !(await this.twoFactors.isEnabled(user.username))) {
      this.logger.log(`User '${user.username}' successfully signed in!`);
      return {
        message: `${user.username} successfully signed in!`,
        status: 'complete',
        tokens: await this.jwt.newTokens({
          sub: user.id,
          username: user.username,
        }),
      };
    } else {
      this.logger.log(`User '${user.username}' partially signed in!`);
      return {
        message: `${user.username} successfully signed in!`,
        status: 'partial',
        token: await this.twoFactors.partialSignIn({
          sub: user.id,
          username: user.username,
        }),
      };
    }
  }

  async usernameExists(username: string) {
    return await this.db.user.count({
      where: { username: username },
    });
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
