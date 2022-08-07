import { Body, Controller, Post } from '@nestjs/common';
import { LocalSignupDto, LocalSigninDto } from './dto';
import { LocalAuthService } from './local-auth.service';

@Controller()
export class LocalAuthController {
  constructor(private service: LocalAuthService) {}
  @Post('signup')
  localSignUp(@Body() dto: LocalSignupDto) {
    return this.service.localSignUp(dto);
  }

  @Post('signin')
  async localSignIn(@Body() dto: LocalSigninDto) {
    return this.service.localSignIn(dto);
  }
}
