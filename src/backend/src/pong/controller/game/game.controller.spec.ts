import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { DbModule } from 'src/db/db.module';
import { GameGatewayService } from 'src/pong/gateway/game/game-gateway.service';
import { GameGateway } from 'src/pong/gateway/game/game.gateway';
import { MatchmakingGatewayService } from 'src/pong/gateway/matchmaking/matchmaking-gateway.service';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { GameDbService } from 'src/pong/service/game-db/game-db.service';
import { GameController } from './game.controller';

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule, JwtModule],
      controllers: [GameController],
      providers: [
        GameDbService,
        JwtAuthService,
        GameCoreService,
        GameGatewayService,
        GameGateway,
        MatchmakingGatewayService,
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
