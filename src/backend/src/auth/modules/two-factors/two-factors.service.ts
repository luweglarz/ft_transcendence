import { Injectable, Logger } from '@nestjs/common';
import { authenticator } from 'otplib';
import { DbService } from 'src/db/db.service';

@Injectable()
export class TwoFactorsService {
  private readonly serviceName: string = 'Transcendence';
  private readonly _logger = new Logger(TwoFactorsService.name);

  constructor(private readonly db: DbService) {}

  enable(userId: number) {
    const secret = authenticator.generateSecret();
    this.db.auth.update({
      data: { twoFactor: true, twoFactorSecret: secret },
      where: { userId: userId },
    });
    return secret;
  }

  generateSecret() {
    return authenticator.generateSecret();
  }

  QRCodeData(username: string, secret: string) {
    return authenticator.keyuri(username, this.serviceName, secret);
  }
}
