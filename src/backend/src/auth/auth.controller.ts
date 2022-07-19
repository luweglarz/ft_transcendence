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
import {
  LocalSigninDto,
  LocalSignupDto,
  OAuthSignUpDto,
  OAuthUserDto,
} from './dto';
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

  @Get('oauth42/signin')
  @UseGuards(OAuth2Guard)
  async oauthSignIn(@Req() req: Request) {
    const user = await this.authService.oauthFindUser(<OAuthUserDto>req.user);
    this.logger.debug(`user: ${JSON.stringify(user, null, 2)}`);
    return this.authService.signInSuccess(user);
  }

  @Get('oauth42/signup-temp-token')
  @UseGuards(OAuth2Guard)
  async oauthSignUpTempToken(@Req() req: Request) {
    return this.authService.oauthSignUpTempToken(<OAuthUserDto>req.user);
  }

  @Post('oauth42/signup')
  async oauthSignUp(@Body() dto: OAuthSignUpDto) {
    const user = await this.authService.oauthCreateUser(dto);
    return this.authService.signInSuccess(user);
  }

  //  ============================ Testing routes ============================  //

  @UseGuards(JwtGuard)
  @Get('private')
  isSignedIn() {
    return { message: 'Private connection established! 👍' };
  }

  @Get('public')
  testPublicRoute() {
    return { message: 'Hello, this is a public route!' };
  }
}
