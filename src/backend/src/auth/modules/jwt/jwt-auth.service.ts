import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import { JwtUser } from './dto';

@Injectable()
export class JwtAuthService {
  private readonly _accessTokenSecret = `access ${process.env['JWT_SECRET']}`;
  private readonly _refreshTokenSecret = `refresh ${process.env['JWT_SECRET']}`;
  private readonly _logger = new Logger(JwtAuthService.name);

  constructor(private jwt: JwtService, private db: DbService) {}

  /*
   * @brief return a fresh pair of tokens and save the refresh token to the db
   */
  async newTokens(payload: JwtUser) {
    this._logger.log(`User '${payload.username}' requested a pair of tokens`);
    const tokenList = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);
    const tokens = { access: tokenList[0], refresh: tokenList[1] };
    this.saveRefreshToken(payload.sub, tokens.refresh);
    return tokens;
  }

  //  =============================== Getters ================================  //

  // Secrets are required to configure the strategies

  get accessTokenSecret() {
    return this._accessTokenSecret;
  }
  get refreshTokenSecret() {
    return this._refreshTokenSecret;
  }

  //  ============================== Sign token ==============================  //

  private signAccessToken(payload: JwtUser): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '42m',
      // expiresIn: 10,
      secret: this._accessTokenSecret,
    });
  }
  private signRefreshToken(payload: JwtUser): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '42h',
      // expiresIn: '42m',
      secret: this._refreshTokenSecret,
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

  //  ================= Save / Clear / Compare refresh token =================  //

  // @brief store token in the database
  private saveRefreshToken(userId: number, rt: string) {
    this.db.auth.update({
      data: { refreshToken: rt },
      where: { userId: userId },
    });
  }

  // @brief remove refresh token stored in db for a given user
  // Needed when sign out
  clearRefreshToken(userId: number) {
    this.db.auth.update({
      data: { refreshToken: null },
      where: { userId: userId },
    });
  }

  // @brief return true if given refresh token matches the on in the database
  async compareRefreshToken(userId: number, rt: string) {
    if (!rt) return false;
    const { refreshToken } = await this.db.auth.findFirst({
      select: { refreshToken: true },
      where: { userId: userId },
    });
    return refreshToken === rt;
  }

  //  ================================ Other =================================  //

  decode<T>(token: string) {
    return <T>this.jwt.decode(token);
  }

  refreshToken() {
    return { message: 'Refresh tokens' };
  }
}
