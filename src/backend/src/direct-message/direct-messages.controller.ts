import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DirectMessagesService } from './direct-messages.service';

@Controller('direct-messages')
export class DirectMessagesController {
  constructor(public dmService: DirectMessagesService) {
    //
  }

  @Get('')
  async getDms() {
    return this.dmService.getDms();
  }

  @Get('user')
  async getUserDms(@Query('username') username: string) {
    return this.dmService.getUserDms(username);
  }

  @Get('conversation')
  async getUsersConversation(
    @Query('author') author: string,
    @Query('target') target: string,
  ) {
    return this.dmService.getUsersConversation(author, target);
  }

  // @Get('add')
  // async addUserDm(
  //   @Query('author') authorName: string,
  //   @Query('target') targetName: string,
  //   @Query('content') content: string,
  // ) {
  //   console.log('Received a post request');
  //   return this.dmService.addUserDm(authorName, targetName, content);
  // }

  @Post('add')
  async addUsersDm(
    @Query('author') authorName: string,
    @Query('target') targetName: string,
    @Body() content,
  ) {
    console.log('Author: ', authorName);
    console.log('Target: ', targetName);
    console.log('Content: ', content.content);

    return this.dmService.addUserDm(authorName, targetName, content.content);
  }
}
