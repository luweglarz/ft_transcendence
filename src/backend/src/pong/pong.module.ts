import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from './gateway/game/game.gateway';
import { GameGatewayService } from './gateway/game/game-gateway.service';
import { MatchmakingGateway } from './gateway/matchmaking/matchmaking.gateway';
import { MatchmakingGatewayService } from './gateway/matchmaking/matchmaking-gateway.service';
import { GameCoreService } from './service/game-core/game-core.service';

@Module({
  controllers: [],
  imports: [JwtModule],
  providers: [
    GameCoreService,
    GameGateway,
    GameGatewayService,
    MatchmakingGateway,
    MatchmakingGatewayService,
  ],
})
export class PongModule {}
