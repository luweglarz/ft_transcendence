import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AvatarService } from '../services/avatar/avatar.service';
import { UsersService } from '../services/users/users.service';

@Controller('users')
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
