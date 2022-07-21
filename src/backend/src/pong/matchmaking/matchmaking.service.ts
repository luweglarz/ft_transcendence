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
  private logger: Logger;

  async generateGameRoom(clientPool: Socket[]) {
    this.logger.log('Enough player to generate a game room');
    const newRoomId: string = uuidv4();
    const newGameMap: GameMap = new GameMap(525, 950, 'black');
    const players: Player[] = [
      new Player(newGameMap, clientPool.pop(), 1, 3, 'white'),
      new Player(newGameMap, clientPool.pop(), 2, 3, 'white'),
    ];
    const newRoom: Room = new Room(players, newRoomId, newGameMap);
    const ball: Ball = new Ball(newGameMap, 2, 'white', 6);

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
        backgroundColor: newRoom.gameMap.backgroundColor,
        ballRadius: ball.radius,
        ballColor: ball.color,
      },
      {
        height: players[0].height,
        width: players[0].width,
        playerOneColor: players[0].color,
        playerTwoColor: players[1].color,
        playerOneUsername: players[0].username,
        playerTwoUsername: players[1].username,
      },
    );
    this.gameService.gameLoopInterval = this.gameService.gameLoop(
      players,
      newRoom,
      this.gameGateway.rooms,
      this.gameGateway.server,
      ball,
    );
  }
}
