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

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('signup')
  localSignUp(@Body() dto: LocalSignupDto) {
    return this.authService.localSignUp(dto);
  }

  @Post('signin')
  async localSignIn(@Body() dto: LocalSigninDto) {
    return this.authService.localSignIn(dto);
  }

  @Post('signout')
  signOut() {
    return this.authService.signOut();
  }

  // @Get('oauth42/authenticate')
  // @UseGuards(OAuth2Guard)
  // oauthAutenticate() {
  //   // redirected by the guard to the authorize url
  // }

  @Get('oauth42/redirect')
  @UseGuards(OAuth2Guard)
  async oauhtRedirectCallback(@Req() req: Request) {
    this.logger.debug(`${this.oauhtRedirectCallback.name} called`);
    this.logger.debug(`user: ${JSON.stringify(req.user, null, 2)}`);
    const user: any = req.user;
    return this.authService.signInSuccess(user);
  }

  //  ============================ Testing routes ============================  //

  @UseGuards(JwtGuard)
  @Get('private')
  isSignedIn() {
    return { message: 'I am signed in!' };
  }

  @Get('public')
  testPublicRoute() {
    return { message: 'Hello, this is a public route!' };
  }
}
