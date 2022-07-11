import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalSigninDto, LocalSignupDto } from './dto';
import { JwtGuard, OAuth2Guard } from './guard';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('auth/signup')
  localSignUp(@Body() dto: LocalSignupDto) {
    return this.authService.localSignup(dto);
  }

  @Post('auth/signin')
  async localSignIn(@Body() dto: LocalSigninDto) {
    return this.authService.localSignin(dto);
  }

  @Post('auth/signout')
  signOut() {
    return this.authService.signOut();
  }

  @UseGuards(JwtGuard)
  @Get('auth/test')
  testSignIn() {
    return { message: 'I am signed in!' };
  }

  @Get('oauth/authenticate')
  @UseGuards(OAuth2Guard)
  oauthAutenticate() {
    // redirected by the guard
  }

  @Get('oauth/redirect')
  @UseGuards(OAuth2Guard)
  async oauhtRedirectCallback(@Req() req: Request) {
    this.logger.debug(`${this.oauhtRedirectCallback.name} called`);
    this.logger.debug(`user: ${JSON.stringify(req.user, null, 2)}`);
    const user: any = req.user;
    return this.authService.signInSuccess(user);
  }
}
