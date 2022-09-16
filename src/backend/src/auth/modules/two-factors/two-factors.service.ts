import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import { JwtData, JwtUser } from '../jwt/dto';

@Injectable()
export class TwoFactorsService {
  private readonly _logger = new Logger(TwoFactorsService.name);
  private readonly _partialSigninTokenSecret = `partial ${process.env['JWT_SECRET']}`;

  constructor(
    private readonly db: DbService,
    private readonly jwt: JwtService,
  ) {}

  partialSignIn(user: JwtUser) {
    return this.jwt.signAsync(user, {
      secret: this._partialSigninTokenSecret,
      expiresIn: '5m',
    });
  }

  verifyPartialSignInToken(token: string) {
    return this.jwt.verifyAsync<JwtData>(token, {
      secret: this._partialSigninTokenSecret,
    });
  }

  async isEnabled(username: string) {
    return (
      await this.db.user.findUnique({
        include: { auth: true },
        where: { username: username },
      })
    ).auth.twoFactor;
  }

  async isEnabledFromId(id: number) {
    return (
      await this.db.user.findUnique({
        include: { auth: true },
        where: { id: id },
      })
    ).auth.twoFactor;
  }
}
