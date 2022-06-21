import { Module } from '@nestjs/common';
import { GameGateway } from './game/game.gateway';
import { GameMatchmakingGateway } from './matchmaking/game-matchmaking.gateway';

@Module({
  controllers: [],
  providers: [GameGateway, GameMatchmakingGateway],
})
export class PongModule {}
