import { Test, TestingModule } from '@nestjs/testing';
import { GameMatchmakingGateway } from './game-matchmaking.gateway';
import { GameGateway } from '../game/game.gateway';
import { GameService } from '../game/game.service';

describe('GameMatchmakingGateway', () => {
  let gateway: GameMatchmakingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameMatchmakingGateway, GameGateway, GameService],
    }).compile();

    gateway = module.get<GameMatchmakingGateway>(GameMatchmakingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
