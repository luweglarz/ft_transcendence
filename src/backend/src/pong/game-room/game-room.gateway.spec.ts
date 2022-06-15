import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from '../game/game.gateway';
import { GameRoomGateway } from './game-room.gateway';
import { GameRoomService } from './game-room.service';

describe('GameRoomGateway', () => {
  let gateway: GameRoomGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRoomGateway, GameGateway, GameRoomService],
    }).compile();

    gateway = module.get<GameRoomGateway>(GameRoomGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
