import { Module } from '@nestjs/common';
import { GameGateway } from '../game/game.gateway';
import { GameRoomController } from './game-room.controller';
import { GameRoomGateway } from './game-room.gateway';
import { GameRoomService } from './game-room.service';

@Module({
  imports: [],
  controllers: [GameRoomController],
  providers: [GameRoomGateway, GameRoomService, GameGateway],
})
export class GameRoomModule {}
