import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/auth';
import { JwtAccessGuard } from '../jwt';
import { JwtUser } from '../jwt/dto';
import { OtpCode } from '../two-factors/dto';
import { AuthenticatorService } from './authenticator.service';
import { AuthenticatorSigninDto } from './dto/authenticator-signin.dto';

@Controller()
export class AuthenticatorController {
  constructor(private service: AuthenticatorService) {}

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

  @Post('signin')
  // TODO: use a guard to check the token instead
  signIn(@Body() dto: AuthenticatorSigninDto) {
    return this.service.signIn(dto.partialToken, dto.otp);
  }
}
