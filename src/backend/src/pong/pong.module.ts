import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';

@Module({
  controllers: [GameController],
  providers: [GameService]
})
export class PongModule {}
