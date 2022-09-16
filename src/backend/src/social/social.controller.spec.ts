import { HttpModule } from '@nestjs/axios';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthModule } from 'src/auth/modules/jwt/jwt-auth.module';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';
import { GameGatewayService } from 'src/pong/gateway/game/game-gateway.service';
import { GameGateway } from 'src/pong/gateway/game/game.gateway';
import { MatchmakingGatewayService } from 'src/pong/gateway/matchmaking/matchmaking-gateway.service';
import { MatchmakingGateway } from 'src/pong/gateway/matchmaking/matchmaking.gateway';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { GameDbService } from 'src/pong/service/game-db/game-db.service';
import { FriendsStatusGateway } from './gateway/friends-status-gateway.gateway';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

describe('SocialController', () => {
  let controller: SocialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, JwtAuthModule, DbModule, HttpModule],
      controllers: [SocialController],
      providers: [
        SocialService,
        MatchmakingGateway,
        MatchmakingGatewayService,
        GameGatewayService,
        GameGateway,
        GameCoreService,
        DbService,
        GameDbService,
        JwtAuthService,
        FriendsStatusGateway,
      ],
    }).compile();

    controller = module.get<SocialController>(SocialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
