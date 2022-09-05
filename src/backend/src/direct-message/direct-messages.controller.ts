import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard, User } from 'src/auth';
import { JwtPayload } from 'src/auth/modules/jwt/interfaces';
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
  @UseGuards(JwtGuard)
  async addUsersDm(
    @Query('target') targetName: string,
    @Body() content,
    @User() user: JwtPayload,
  ) {
    return this.dmService.addUserDm(user.username, targetName, content.content);
  }
}
