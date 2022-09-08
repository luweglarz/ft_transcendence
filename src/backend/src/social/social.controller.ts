import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAccessGuard, User } from 'src/auth';
import { JwtUser } from 'src/auth/modules/jwt/dto';
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
  @UseGuards(JwtAccessGuard)
  async addUserRelation(
    @Query('target') targetName: string,
    @Query('relation') relation: string,
    @User() user: JwtUser,
  ) {
    return this.socialService.addUserRelation(
      user.username,
      targetName,
      relation,
    );
  }
}
