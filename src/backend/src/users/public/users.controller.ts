import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
// import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { AvatarService } from '../services/avatar/avatar.service';
import { UsersService } from '../services/users/users.service';

@Controller('users')
// @UseGuards(JwtGuard)
export class UsersController {
  constructor(private service: UsersService, private avatar: AvatarService) {}

  @Get('')
  async listUsers() {
    return this.service.listUsers();
  }

  @Get(':username/has-avatar')
  async hasAvatar(@Param('username') username: string) {
    return this.avatar.hasAvatar(username);
  }

  @Get(':username/avatar')
  async downloadAvatar(
    @Param('username') username: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.avatar.getResponse(username, res);
  }
}
