import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingGateway } from '../matchmaking/matchmaking.gateway';
import { MatchmakingService } from '../matchmaking/matchmaking-gateway.service';
import { GameGateway } from './game.gateway';
import { GameGatewayService } from './game-gateway.service';

describe('GameGateway', () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGateway,
        MatchmakingGateway,
        GameGatewayService,
        MatchmakingService,
      ],
      imports: [JwtModule],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
