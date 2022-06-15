import { Test, TestingModule } from '@nestjs/testing';
import { GameRoomGateway } from './game-room.gateway';

describe('GameRoomGateway', () => {
  let gateway: GameRoomGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRoomGateway],
    }).compile();

    gateway = module.get<GameRoomGateway>(GameRoomGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
