import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
  constructor(private service: AuthService) {}

  @Post('local/signup')
  localSignUp(@Body() dto: LocalSignupDto) {
    return this.service.localSignUp(dto);
  }

  @Post('local/signin')
  async localSignIn(@Body() dto: LocalSigninDto) {
    return this.service.localSignIn(dto);
  }

  @Post('oauth42/signin')
  @UseGuards(OAuth2Guard)
  async oauthSignIn(@Req() req: Request) {
    return this.service.oauthSignIn(<OAuthUserDto>req.user);
  }

  @Get('oauth42/signup-temp-token')
  @UseGuards(OAuth2Guard)
  async oauthSignUpTempToken(@Req() req: Request) {
    return this.service.oauthSignUpTempToken(<OAuthUserDto>req.user);
  }

  @Post('oauth42/signup')
  async oauthSignUp(@Body() dto: OAuthSignUpDto) {
    return this.service.oauthSignUp(dto);
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
