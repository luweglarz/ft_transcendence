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

  @Post('add')
  async addUsersDm(
    @Query('author') authorName: string,
    @Query('target') targetName: string,
    @Body() content,
  ) {
    return this.dmService.addUserDm(authorName, targetName, content.content);
  }
}
