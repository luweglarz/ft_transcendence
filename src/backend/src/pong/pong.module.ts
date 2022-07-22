import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';
import { MatchmakingGateway } from './matchmaking/matchmaking.gateway';
import { MatchmakingService } from './matchmaking/matchmaking.service';

@Module({
  controllers: [],
  imports: [JwtModule],
  providers: [GameGateway, GameService, MatchmakingGateway, MatchmakingService],
})
export class PongModule {}
