import { Module } from '@nestjs/common';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';

@Module({
  controllers: [],
  providers: [GameGateway, GameService],
})
export class PongModule {}
