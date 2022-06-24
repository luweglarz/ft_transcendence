import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { RoomService } from './room/room.service';

@Module({
  providers: [ChatGateway, RoomService],
  controllers: [ChatController]
})
export class ChatModule {}
