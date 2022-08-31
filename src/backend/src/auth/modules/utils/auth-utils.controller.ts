import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../jwt';
import { AuthUtilsService } from './auth-utils.service';

@Controller()
export class AuthUtilsController {
  constructor(private service: AuthUtilsService) {}

  @Get('exists/username/:username')
  async usernameAlreadyExists(@Param('username') username: string) {
    return {
      username: username,
      exists: await this.service.usernameExists(username),
    };
  }

  //  ============================ Testing routes ============================  //

  @UseGuards(JwtAccessGuard)
  @Get('private')
  isSignedIn() {
    return { message: 'Private connection established! 👍' };
  }

  @Get('public')
  testPublicRoute() {
    return { message: 'Hello, this is a public route!' };
  }
}
