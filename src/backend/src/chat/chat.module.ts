import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { RoomService } from './room/room.service';
import { RoomUserService } from './room-user/room-user.service';
import { MessageService } from './message/message.service';
import { CommandService } from './command/command.service';
import { JwtAuthModule } from 'src/auth/modules/jwt/jwt-auth.module';
import { JailUserService } from './jail-user/jailUser.service';

@Module({
  providers: [
    ChatGateway,
    RoomService,
    RoomUserService,
    MessageService,
    CommandService,
    JailUserService,
  ],
  controllers: [ChatController],
  imports: [JwtAuthModule],
})
export class ChatModule {}
