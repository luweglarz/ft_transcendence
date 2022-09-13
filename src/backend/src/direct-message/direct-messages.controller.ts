import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAccessGuard, User } from 'src/auth';
import { JwtUser } from 'src/auth/modules/jwt/dto';
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
  @UseGuards(JwtAccessGuard)
  async addUsersDm(
    @Query('target') targetName: string,
    @Body() content,
    @User() user: JwtUser,
  ) {
    return this.dmService.addUserDm(user.username, targetName, content.content);
  }
}
