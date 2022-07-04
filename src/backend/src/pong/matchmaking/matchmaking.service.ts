import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameMap } from '../class/game-map';
import { Player } from '../class/player';
import { Room } from '../class/room';
import { GameGateway } from '../game/game.gateway';

@Injectable()
export class MatchmakingService {
  constructor(
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
  ) {
    //Todo
  }

  private logger: Logger = new Logger('GameMatchMakingGateway');

  async generateGameRoom(clientPool: Socket[]) {
    this.logger.log('Enough player to generate a game room');
    const newRoomId: string = uuidv4();
    const newGameMap: GameMap = new GameMap(525, 850, 'white', 'black');
    const players: Player[] = [
      new Player(newGameMap, clientPool.pop(), 1),
      new Player(newGameMap, clientPool.pop(), 2),
    ];
    const newRoom: Room = new Room(players, newRoomId, newGameMap);
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
      },
      { height: players[0].height, width: players[1].width },
    );
    setInterval(() => {
      this.gameGateway.server
        .to(newRoomId)
        .emit(
          'gameUpdate',
          { x: players[0].x, y: players[0].y },
          { x: players[1].x, y: players[1].y },
        );
    }, 15);
  }
}
