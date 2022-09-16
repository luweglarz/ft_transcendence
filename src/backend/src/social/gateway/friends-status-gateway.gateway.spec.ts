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
import { PongModule } from 'src/pong/pong.module';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { GameDbService } from 'src/pong/service/game-db/game-db.service';
import { SocialService } from '../social.service';
import { FriendsStatusGateway } from './friends-status-gateway.gateway';

describe('FriendsStatusGateway', () => {
  let gateway: FriendsStatusGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, JwtAuthModule, DbModule, HttpModule, PongModule],
      providers: [
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

    gateway = module.get<FriendsStatusGateway>(FriendsStatusGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
