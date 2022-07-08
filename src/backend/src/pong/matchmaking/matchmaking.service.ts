import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Ball } from '../class/ball';
import { GameMap } from '../class/game-map';
import { Player } from '../class/player';
import { Room } from '../class/room';
import { GameGateway } from '../game/game.gateway';
import { GameService } from '../game/game.service';

@Injectable()
export class MatchmakingService {
  constructor(
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
    private gameService: GameService,
  ) {
    this.logger = new Logger('GameMatchMakingGateway');
  }

  public gameLoopInterval: any;
  private logger: Logger;

  async generateGameRoom(clientPool: Socket[]) {
    this.logger.log('Enough player to generate a game room');
    const newRoomId: string = uuidv4();
    const newGameMap: GameMap = new GameMap(525, 850, 'black', 'white');
    const players: Player[] = [
      new Player(newGameMap, clientPool.pop(), 1, 5),
      new Player(newGameMap, clientPool.pop(), 2, 5),
    ];
    const newRoom: Room = new Room(players, newRoomId, newGameMap);
    const ball: Ball = new Ball(newGameMap, 2);

    await players[0].socket.join(newRoomId);
    await players[1].socket.join(newRoomId);
    this.gameGateway.rooms.push(newRoom);
    this.logger.log(
      `Match between ${players[0].socket.id} & ${players[1].socket.id} in ${newRoomId}`,
    );
    this.gameGateway.server.to(newRoomId).emit(
      'matchFound',
      'A match has been found',
      {
        canvaHeight: newRoom.gameMap.canvaHeight,
        canvaWidth: newRoom.gameMap.canvaWidth,
        borderHeight: newRoom.gameMap.borderHeight,
        borderWidth: newRoom.gameMap.borderWidth,
        backgroundColor: newRoom.gameMap.backgroundColor,
        ballRadius: ball.radius,
      },
      { height: players[0].height, width: players[1].width },
    );
    this.gameLoopInterval = this.gameService.gameLoop(
      players,
      newRoom,
      this.gameGateway.server,
      ball,
    );
  }
}
