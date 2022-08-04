import { Room } from '../class/room/room';
import { Server } from 'socket.io';
import { Ball } from '../class/ball/ball';
import { GameCoreService } from '../service/game-core/game-core.service';

export interface GameMode {
  get canvaWidth(): number;
  get canvaHeight(): number;
  get backgroundColor(): string;
  get ball(): Ball;

  gameLoop(
    gameRoom: Room,
    rooms: Room[],
    server: Server,
    gameCoreService: GameCoreService,
  ): any;
  emitGameUpdate(server: Server, gameRoom: Room, ball: Ball): void;
}
