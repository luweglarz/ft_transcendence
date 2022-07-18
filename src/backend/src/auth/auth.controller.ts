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
import { LocalSigninDto, LocalSignupDto, OAuthUserDto } from './dto';
import { JwtGuard, OAuth2Guard } from './guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  localSignUp(@Body() dto: LocalSignupDto) {
    return this.authService.localSignUp(dto);
  }

  @Post('local/signin')
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
    const user = await this.authService.oauthFindOrCreate(
      <OAuthUserDto>req.user,
    );
    this.logger.debug(`user: ${JSON.stringify(user, null, 2)}`);
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
