import { Test, TestingModule } from '@nestjs/testing';
import { GameMatchmakingGateway } from './game-matchmaking.gateway';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

describe('GameMatchmakingGateway', () => {
  let gateway: GameMatchmakingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameMatchmakingGateway, GameService, GameGateway],
    }).compile();

    gateway = module.get<GameMatchmakingGateway>(GameMatchmakingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
