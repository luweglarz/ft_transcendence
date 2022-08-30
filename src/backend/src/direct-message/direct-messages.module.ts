import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { DirectMessagesController } from './direct-messages.controller';
import { DirectMessagesService } from './direct-messages.service';

@Module({
  imports: [HttpModule],
  controllers: [DirectMessagesController],
  providers: [DirectMessagesService, DbService],
  exports: [],
})
export class DirectMessagesModule {}
