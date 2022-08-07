import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingGateway } from '../matchmaking/matchmaking.gateway';
import { GameGateway } from './game.gateway';
import { GameGatewayService } from './game-gateway.service';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { DbService } from 'src/db/db.service';
import { GameDbService } from 'src/pong/service/game-db/game-db.service';
import { MatchmakingGatewayService } from '../matchmaking/matchmaking-gateway.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';

describe('GameGateway', () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGateway,
        MatchmakingGateway,
        MatchmakingGatewayService,
        GameGatewayService,
        GameCoreService,
        DbService,
        GameDbService,
        JwtAuthService,
      ],
      imports: [JwtModule],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
