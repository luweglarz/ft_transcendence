import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard, User } from 'src/auth';
import { JwtPayload } from 'src/auth/modules/jwt/interfaces';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
  constructor(public socialService: SocialService) {
    //
  }

  @Get('')
  async getSocialList() {
    return this.socialService.getSocial();
  }

  @Get('friends')
  async getUserFriends(@Query('username') username: string) {
    return this.socialService.getUserFriends(username);
  }

  @Get('blocked')
  async getUserBlocked(@Query('username') username: string) {
    return this.socialService.getUserBlocked(username);
  }

  @Post('add')
  @UseGuards(JwtGuard)
  async addUserRelation(
    @Query('target') targetName: string,
    @Query('relation') relation: string,
    @User() user: JwtPayload,
  ) {
    return this.socialService.addUserRelation(
      user.username,
      targetName,
      relation,
    );
  }
}
