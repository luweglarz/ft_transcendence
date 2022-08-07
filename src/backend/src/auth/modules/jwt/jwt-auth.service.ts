import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, OAuthJwtPayload } from './interfaces';

@Injectable()
export class JwtAuthService {
  private readonly _accessTokenSecret = `access ${process.env['JWT_SECRET']}`;
  private readonly _refreshTokenSecret = `refresh ${process.env['JWT_SECRET']}`;
  private readonly _tempTokenSecret = `temp ${process.env['JWT_SECRET']}`;

  constructor(private jwt: JwtService) {}

  //  =============================== Getters ================================  //

  get accessTokenSecret() {
    return this._accessTokenSecret;
  }

  get refreshTokenSecret() {
    return this._accessTokenSecret;
  }

  //  ============================== Sign token ==============================  //

  signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '42m',
      secret: this._accessTokenSecret,
    });
  }

  signRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '42m',
      secret: this._refreshTokenSecret,
    });
  }

  signTempToken(payload: OAuthJwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret: this._tempTokenSecret,
    });
  }

  //  ============================= Verify token =============================  //

  verifyAccessToken(token: string, sync?: 'sync') {
    if (sync)
      return this.jwt.verify(token, { secret: this._accessTokenSecret });
    else
      return this.jwt.verifyAsync(token, { secret: this._accessTokenSecret });
  }
  verifyRefreshToken(token: string) {
    return this.jwt.verifyAsync(token, { secret: this._refreshTokenSecret });
  }
  verifyTempToken(token: string) {
    return this.jwt.verifyAsync(token, { secret: this._tempTokenSecret });
  }

  //  ================================ Other =================================  //

  decode<T>(token: string) {
    return <T>this.jwt.decode(token);
  }

  refreshToken() {
    return { message: 'Refresh tokens' };
  }
}
