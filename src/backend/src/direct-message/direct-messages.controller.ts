import { Controller, Get, Query } from '@nestjs/common';
import { DirectMessagesService } from './direct-messages.service';

@Controller('direct-messages')
export class DirectMessagesController {
  constructor(public DmService: DirectMessagesService) {
    //
  }

  @Get('')
  async getDms() {
    return 'Tout les DMS';
  }

  @Get('friends')
  async getUserDms(
    @Query('author') author: string,
    @Query('target') target: string,
  ) {
    return 'Les DMS entre ' + author + ' et ' + target;
  }

  @Get('add')
  async addUserDms(
    @Query('author') author: string,
    @Query('target') target: string,
    @Query('content') content: string,
  ) {
    return 'Send ' + content + ' entre ' + author + ' et ' + target;
  }
}
