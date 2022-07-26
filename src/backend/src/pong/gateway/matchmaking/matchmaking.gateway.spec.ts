import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from '../game/game.gateway';
import { GameGatewayService } from '../game/game-gateway.service';
import { MatchmakingGateway } from './matchmaking.gateway';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { MatchmakingGatewayService } from './matchmaking-gateway.service';

describe('MatchmakingGateway', () => {
  let gateway: MatchmakingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchmakingGateway,
        MatchmakingGatewayService,
        GameGatewayService,
        GameGateway,
        GameCoreService,
      ],
      imports: [JwtModule],
    }).compile();

    gateway = module.get<MatchmakingGateway>(MatchmakingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
