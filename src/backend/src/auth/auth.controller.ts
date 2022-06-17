import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup() {
    return this.authService.signup();
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin() {
    return this.authService.signin();
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout() {
    return this.authService.signout();
  }
}
