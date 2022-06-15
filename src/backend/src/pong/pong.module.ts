import { Module } from '@nestjs/common';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';
import { GameRoomModule } from './game-room/game-room.module';

@Module({
  controllers: [],
  providers: [GameGateway, GameService],
  imports: [GameRoomModule],
})
export class PongModule {}
