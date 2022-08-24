import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { JwtAccessGuard } from '../jwt';
import { JwtUser } from '../jwt/dto';
import { OtpCode } from './dto';
import { TwoFactorsService } from './two-factors.service';

@Controller()
@UseGuards(JwtAccessGuard)
export class TwoFactorsController {
  constructor(private service: TwoFactorsService) {}

  @Get('is-enabled')
  isEnabled(@User() user: JwtUser) {
    return this.service.isEnabled(user.sub);
  }

  @Get('enable')
  enable(@User() user: JwtUser) {
    return this.service.enable(user);
  }

  @Get('disable')
  disable(@User() user: JwtUser) {
    this.service.disable(user.sub);
    return true;
  }

  @Post('verify')
  verify(@User() user: JwtUser, @Body() code: OtpCode) {
    return this.service.verify(user.sub, code.code);
  }
}
