import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { authenticator } from 'otplib';
import { DbService } from 'src/db/db.service';
import { JwtUser } from '../jwt/dto';
import { TwoFactorSecret } from '../two-factors/dto';
import { TwoFactorsService } from '../two-factors/two-factors.service';
import { AuthUtilsService } from '../utils/auth-utils.service';

@Injectable()
export class AuthenticatorService {
  private readonly serviceName: string = 'Transcendence';
  private readonly _logger = new Logger(AuthenticatorService.name);

  constructor(
    private readonly db: DbService,
    private twoFactor: TwoFactorsService,
    private signinService: AuthUtilsService,
  ) {}

  async signIn(partialToken: string, code: string) {
    const userData = await this.twoFactor.verifyPartialSignInToken(
      partialToken,
    );
    if (!userData || !(await this.verify(userData.sub, code)))
      throw new ForbiddenException('2FA failed');
    return this.signinService.signInSuccess(
      {
        id: userData.sub,
        username: userData.username,
      },
      '2FA',
    );
  }

  /*
   * @brief Enable 2FA and return generated secret
   */
  async enable(user: JwtUser): Promise<TwoFactorSecret> {
    const secret = this.generateSecret();
    await this.db.auth.update({
      data: { twoFactor: true, twoFactorSecret: secret },
      where: { userId: user.sub },
    });
    this._logger.log(`${user.username} enabled 2FA`);
    return {
      secret: secret,
      QRCodeData: this.QRCodeData(user.username, secret),
    };
  }

  async disable(userId: number) {
    await this.db.auth.update({
      data: { twoFactor: false, twoFactorSecret: null },
      where: { userId: userId },
    });
  }

  async verify(userId: number, code: string) {
    console.debug(`Received code: ${code}`);
    console.debug(code);
    const secret = (
      await this.db.auth.findUnique({
        select: { twoFactorSecret: true },
        where: { userId: userId },
      })
    ).twoFactorSecret;
    return authenticator.check(code, secret);
  }

  //  =========================== Private Methods ============================  //

  private generateSecret() {
    return authenticator.generateSecret();
  }

  private QRCodeData(username: string, secret: string) {
    return authenticator.keyuri(username, this.serviceName, secret);
  }
}
