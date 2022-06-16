import { Module } from '@nestjs/common';
import { GameMatchmakingGateway } from './game/game-matchmaking.gateway';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';

@Module({
  controllers: [],
  providers: [GameGateway, GameMatchmakingGateway, GameService],
})
export class PongModule {}
