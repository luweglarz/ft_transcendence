import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from '../game/game.gateway';
import { GameGatewayService } from '../game/game-gateway.service';
import { MatchmakingGateway } from './matchmaking.gateway';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { MatchmakingGatewayService } from './matchmaking-gateway.service';
import { DbService } from 'src/db/db.service';
import { GameDbService } from 'src/pong/service/game-db/game-db.service';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { SocialModule } from 'src/social/social.module';
import { FriendsStatusGateway } from 'src/social/gateway/friends-status-gateway.gateway';

describe('MatchmakingGatewayService', () => {
  let service: MatchmakingGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchmakingGateway,
        MatchmakingGatewayService,
        GameGateway,
        MatchmakingGateway,
        GameGatewayService,
        GameCoreService,
        DbService,
        GameDbService,
        JwtAuthService,
        FriendsStatusGateway,
      ],
      imports: [JwtModule, SocialModule],
    }).compile();

    service = module.get<MatchmakingGatewayService>(MatchmakingGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
