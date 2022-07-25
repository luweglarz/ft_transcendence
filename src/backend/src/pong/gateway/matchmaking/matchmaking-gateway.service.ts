import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Ball } from '../../class/ball/ball';
import { Player } from '../../class/player/player';
import { Room } from '../../class/room/room';
import { GameGateway } from '../game/game.gateway';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { GameMap } from 'src/pong/class/game-map/game-map';

@Injectable()
export class MatchmakingService {
  constructor(
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
    private gameCoreService: GameCoreService,
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

  private emitMatchFound(newRoom: Room, ball: Ball, players: Player[]) {
    this.gameGateway.server.to(newRoom.uuid).emit(
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
  }

  generateGameRoom(gameMap: GameMap, ball: Ball, players: Player[]) {
    this.logger.log('Enough player to generate a game room');
    const newRoom: Room = new Room(uuidv4(), gameMap, players, ball);

    this.gameGateway.rooms.push(newRoom);
    this.logger.log(
      `Match between ${newRoom.players[0].username} & ${newRoom.players[1].username} in ${newRoom.uuid}`,
    );
    this.emitMatchFound(newRoom, newRoom.ball, newRoom.players);
    newRoom.gameLoopInterval = this.gameCoreService.gameLoop(
      newRoom,
      this.gameGateway.rooms,
      this.gameGateway.server,
    );
  }
}
