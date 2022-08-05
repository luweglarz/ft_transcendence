import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorator';
import { LocalSigninDto, LocalSignupDto } from './local/dto';
import { OAuthSignUpDto, OAuthUserDto } from './oauth/dto';
import { JwtGuard } from './jwt/guard';
import { OAuth2Guard } from './oauth/guard';

@Controller('auth')
export class AuthController {
  private readonly client_id = process.env['OAUTH_42_CLIENT_ID'];

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
  async oauthSignIn(@User() user: OAuthUserDto) {
    return this.service.oauthSignIn(user);
  }

  @Get('oauth42/signup-temp-token')
  @UseGuards(OAuth2Guard)
  async oauthSignUpTempToken(@User() user: OAuthUserDto) {
    return this.service.oauthSignUpTempToken(user);
  }

  @Post('oauth42/signup')
  async oauthSignUp(@Body() dto: OAuthSignUpDto) {
    return this.service.oauthSignUp(dto);
  }

  @Get('oauth42/client_id')
  getOAuthClientId() {
    return { client_id: this.client_id };
  }

  @Get('exists/username/:username')
  async usernameAlreadyExists(@Param('username') username: string) {
    return {
      username: username,
      exists: await this.service.alreadyExists('username', username),
    };
  }

  @Get('exists/email/:email')
  async emailAlreadyExists(@Param('email') email: string) {
    return {
      email: email,
      exists: await this.service.alreadyExists('email', email),
    };
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
