import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { JwtAccessGuard } from '../jwt';
import { JwtUser } from '../jwt/dto';
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
}
