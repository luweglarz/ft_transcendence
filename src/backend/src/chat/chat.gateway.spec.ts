import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message/message.service';
import { RoomUserService } from './room-user/room-user.service';
import { RoomService } from './room/room.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        DbService,
        RoomUserService,
        MessageService,
        JwtService,
        RoomService,
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
