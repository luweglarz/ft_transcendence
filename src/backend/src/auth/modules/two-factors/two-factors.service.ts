import { Injectable, Logger } from '@nestjs/common';
import { authenticator } from 'otplib';
import { DbService } from 'src/db/db.service';
import { JwtUser } from '../jwt/dto';
import { TwoFactorSecret } from './dto';

@Injectable()
export class TwoFactorsService {
  private readonly serviceName: string = 'Transcendence';
  private readonly _logger = new Logger(TwoFactorsService.name);

  constructor(private readonly db: DbService) {}

  async isEnabled(userId: number) {
    return (
      await this.db.auth.findUnique({
        select: { twoFactor: true },
        where: { userId: userId },
      })
    ).twoFactor;
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
