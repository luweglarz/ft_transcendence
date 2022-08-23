import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { JwtAccessGuard } from '../jwt';
import { JwtUser } from '../jwt/dto';
import { TwoFactorSecret } from './dto';
import { TwoFactorsService } from './two-factors.service';

@Controller()
@UseGuards(JwtAccessGuard)
export class TwoFactorsController {
  constructor(private service: TwoFactorsService) {}
  @Get('generate-secret')
  generateSecret(@User() user: JwtUser): TwoFactorSecret {
    const secret = this.service.generateSecret();
    return {
      secret: secret,
      QRCodeData: this.service.QRCodeData(user.username, secret),
    };
  }
}
