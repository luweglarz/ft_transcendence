import { Module } from '@nestjs/common';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';
import { GameMatchmakingGateway } from './matchmaking/game-matchmaking.gateway';

@Module({
  controllers: [],
  providers: [GameGateway, GameMatchmakingGateway, GameService],
})
export class PongModule {}
