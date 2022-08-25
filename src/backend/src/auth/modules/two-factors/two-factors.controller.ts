import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { JwtAccessGuard } from '../jwt';
import { JwtUser } from '../jwt/dto';
import { OtpCode } from './dto';
import { TwoFactorsService } from './two-factors.service';

@Controller()
export class TwoFactorsController {
  constructor(private service: TwoFactorsService) {}

  @Get('is-enabled/:username')
  isEnabledFor(@Param('username') username: string) {
    return this.service.isEnabled(username);
  }

  @Get('is-enabled')
  @UseGuards(JwtAccessGuard)
  isEnabled(@User() user: JwtUser) {
    return this.service.isEnabled(user.username);
  }

  @Get('enable')
  @UseGuards(JwtAccessGuard)
  enable(@User() user: JwtUser) {
    return this.service.enable(user);
  }

  @Get('disable')
  @UseGuards(JwtAccessGuard)
  disable(@User() user: JwtUser) {
    this.service.disable(user.sub);
    return true;
  }

  @Post('verify')
  @UseGuards(JwtAccessGuard)
  verify(@User() user: JwtUser, @Body() code: OtpCode) {
    // console.log(code);
    return this.service.verify(user.sub, code.code);
  }
}
