import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from './gateway/game/game.gateway';
import { GameGatewayService } from './gateway/game/game-gateway.service';
import { MatchmakingGateway } from './gateway/matchmaking/matchmaking.gateway';
import { MatchmakingGatewayService } from './gateway/matchmaking/matchmaking-gateway.service';
import { GameCoreService } from './service/game-core/game-core.service';
import { DbService } from 'src/db/db.service';
import { GameDbService } from './service/game-db/game-db.service';

@Module({
  controllers: [],
  imports: [JwtModule],
  providers: [
    GameCoreService,
    GameGateway,
    GameGatewayService,
    MatchmakingGateway,
    MatchmakingGatewayService,
    GameDbService,
  ],
})
export class PongModule {}
