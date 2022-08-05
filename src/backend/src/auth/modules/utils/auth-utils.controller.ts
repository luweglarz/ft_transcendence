import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../jwt';
import { AuthUtilsService } from './auth-utils.service';

@Controller()
export class AuthUtilsController {
  constructor(private service: AuthUtilsService) {}

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
