import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from '../game/game.gateway';
import { GameGatewayService } from '../game/game-gateway.service';
import { MatchmakingGateway } from './matchmaking.gateway';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { MatchmakingGatewayService } from './matchmaking-gateway.service';
import { DbService } from 'src/db/db.service';
import { GameDbService } from 'src/pong/service/game-db/game-db.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { FriendsStatusGateway } from 'src/social/gateway/friends-status-gateway.gateway';
import { SocialModule } from 'src/social/social.module';

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
        DbService,
        GameDbService,
        JwtAuthService,
        FriendsStatusGateway,
      ],
      imports: [JwtModule, SocialModule],
    }).compile();

    gateway = module.get<MatchmakingGateway>(MatchmakingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
