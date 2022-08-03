import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { GameGatewayService } from 'src/pong/gateway/game/game-gateway.service';
import { GameGateway } from 'src/pong/gateway/game/game.gateway';
import { MatchmakingGatewayService } from 'src/pong/gateway/matchmaking/matchmaking-gateway.service';
import { GameDbService } from '../game-db/game-db.service';
import { GameCoreService } from './game-core.service';

describe('GameCoreService', () => {
  let service: GameCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameCoreService,
        GameGatewayService,
        GameGateway,
        GameGatewayService,
        JwtService,
        DbService,
        GameDbService,
        MatchmakingGatewayService,
      ],
    }).compile();

    service = module.get<GameCoreService>(GameCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
