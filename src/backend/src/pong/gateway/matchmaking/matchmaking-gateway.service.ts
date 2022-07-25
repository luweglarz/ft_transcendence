import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Ball } from '../../class/ball/ball';
import { GameMap } from '../../class/game-map/game-map';
import { Player } from '../../class/player/player';
import { Room } from '../../class/room/room';
import { GameGateway } from '../game/game.gateway';
import { GameGatewayService } from '../game/game-gateway.service';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';

@Injectable()
export class MatchmakingService {
  constructor(
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway, private gameCoreService: GameCoreService,
  ) {}
  
  private logger: Logger = new Logger('GameMatchMakingGateway');

  isClientInGame(client: Socket): boolean {
    for (const room of this.gameGateway.rooms) {
      for (const player of room.players) {
        if (
          player.socket.handshake.auth.token === client.handshake.auth.token
        ) {
          client.emit('error', 'You are already in a game');
          return true;
        }
      }
    }
    return false;
  }

  isClientInMatchmaking(client: Socket, clientPool: Socket[]): boolean {
    for (const clientToken of clientPool) {
      if (clientToken.handshake.auth.token === client.handshake.auth.token)
        return true;
    }
    return false;
  }

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
    this.gameCoreService.gameLoopInterval = this.gameCoreService.gameLoop(
      players,
      newRoom,
      this.gameGateway.rooms,
      this.gameGateway.server,
      ball,
    );
  }
}
