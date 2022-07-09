import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UsernameSigninDto, EmailSignupDto } from './dto';
import { JwtGuard, OAuth2Guard } from './guard';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('auth/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: EmailSignupDto) {
    // console.log(dto);
    this.logger.debug(`Incoming signup dto: ${JSON.stringify(dto, null, 2)}`);
    return this.authService.localSignup(dto);
  }

  @Post('auth/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: UsernameSigninDto) {
    // this.logger.debug(`OAUTH client ID: ${process.env['OAUTH_42_CLIENT_ID']}`);
    return this.authService.signin(dto);
  }

  @Post('auth/signout')
  @HttpCode(HttpStatus.OK)
  signout(@Body() dto: EmailSignupDto) {
    return this.authService.signout(dto);
  }

  @UseGuards(JwtGuard)
  @Get('auth/test')
  check_signin() {
    return { message: 'I am signed in !' };
  }

  @Get('oauth/authenticate')
  @UseGuards(OAuth2Guard)
  oauthAutenticate() {
    //
  }

  @Get('oauth/redirect')
  @UseGuards(OAuth2Guard)
  async oauhtRedirectCallback(@Req() req: Request) {
    this.logger.debug(`${this.oauhtRedirectCallback.name} called`);
    this.logger.debug(`user: ${JSON.stringify(req.user, null, 2)}`);
    const user: any = req.user;
    return { message: `welcome ${user.username}` };
  }
}
