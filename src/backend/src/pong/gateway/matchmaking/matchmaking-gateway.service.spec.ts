import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from '../game/game.gateway';
import { GameGatewayService } from '../game/game-gateway.service';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingService } from './matchmaking-gateway.service';

describe('MatchmakingService', () => {
  let service: MatchmakingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchmakingService,
        GameGateway,
        MatchmakingGateway,
        GameGatewayService,
      ],
      imports: [JwtModule],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
