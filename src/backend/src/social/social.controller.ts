import { Controller, Get, Post, Query } from '@nestjs/common';
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

  // @Get('add')
  // async addUserRelation(
  //   @Query('author') authorName: string,
  //   @Query('target') targetName: string,
  //   @Query('relation') relation: string,
  // ) {
  //   return this.socialService.addUserRelation(authorName, targetName, relation);
  // }

  @Post('add')
  async addUserRelation(
    @Query('author') authorName: string,
    @Query('target') targetName: string,
    @Query('relation') relation: string,
  ) {
    return this.socialService.addUserRelation(authorName, targetName, relation);
  }
}
