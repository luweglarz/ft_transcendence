import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { RoomService } from './room/room.service';
import { RoomUserService } from './room-user/room-user.service';
import { MessageService } from './message/message.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ChatGateway, RoomService, RoomUserService, MessageService],
  controllers: [ChatController],
  imports: [JwtModule],
})
export class ChatModule {}
