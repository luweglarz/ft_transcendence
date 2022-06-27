import { Test, TestingModule } from '@nestjs/testing';
import { GameMatchmakingGateway } from '../matchmaking/game-matchmaking.gateway';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

describe('GameGateway', () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameGateway, GameMatchmakingGateway, GameService],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
