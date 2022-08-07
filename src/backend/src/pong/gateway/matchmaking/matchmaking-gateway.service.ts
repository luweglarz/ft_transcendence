import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Ball } from '../../class/ball/ball';
import { Player } from '../../class/player/player';
import { Room } from '../../class/room/room';
import { GameGateway } from '../game/game.gateway';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { GameMap } from 'src/pong/class/game-map/game-map';
import { GameGatewayService } from '../game/game-gateway.service';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';

@Injectable()
export class MatchmakingGatewayService {
  constructor(
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
    private gameCoreService: GameCoreService,
    private gameGatewayService: GameGatewayService,
    private jwtService: JwtAuthService,
  ) {}

  private logger: Logger = new Logger('GameMatchMakingGateway');

  isClientInGame(client: Socket): boolean {
    for (const room of this.gameGateway.rooms) {
      for (const player of room.players) {
        if (
          player.socket.handshake.auth.token === client.handshake.auth.token ||
          JSON.parse(
            JSON.stringify(this.jwtService.decode(client.handshake.auth.token)),
          ).username === player.username
        )
          return true;
      }
    }
    return false;
  }

  isClientInMatchmaking(client: Socket, clientPools: Socket[][]): boolean {
    for (const pool of clientPools) {
      for (const clientPool of pool) {
        if (
          clientPool.handshake.auth.token === client.handshake.auth.token ||
          JSON.parse(
            JSON.stringify(this.jwtService.decode(client.handshake.auth.token)),
          ).username ===
            JSON.parse(
              JSON.stringify(
                this.jwtService.decode(clientPool.handshake.auth.token),
              ),
            ).username
        )
          return true;
      }
    }
    return false;
  }

  clientJoinMatchmaking(
    client: Socket,
    clientPools: Socket[][],
    gameType: string,
  ) {
    if (gameType === 'normal') {
      clientPools[0].push(client);
      client.emit('waitingForAMatch', 'Waiting for a normal match');
      if (clientPools[0].length > 1) this.createGame(clientPools[0], gameType);
    }
  }

  clientLeaveMatchmaking(client: Socket, clientPools: Socket[][]) {
    for (const pool of clientPools) {
      for (const clientToken of pool) {
        if (clientToken.handshake.auth.token === client.handshake.auth.token) {
          pool.splice(
            pool.findIndex((element) => element === client),
            1,
          );
          this.logger.log(`A client has left the matchmaking: ${client.id}`);
          client.emit('matchmakingLeft', 'You have left the matchmaking');
          client.disconnect();
          return;
        }
      }
    }
    client.emit('error', 'You are not in a matchmaking');
  }

  private createGame(clientPool: Socket[], gameType: string) {
    let gameMap: GameMap;
    let players: Player[];
    let ball: Ball;

    if (gameType == 'normal') {
      gameMap = new GameMap(525, 950, 'black');
      players = [
        new Player(gameMap, clientPool.pop(), 1, 3, 'white'),
        new Player(gameMap, clientPool.pop(), 2, 3, 'white'),
      ];
      ball = new Ball(gameMap, 2, 'white', 6);
    }
    this.generateGameRoom(gameMap, ball, players);
  }

  private generateGameRoom(gameMap: GameMap, ball: Ball, players: Player[]) {
    this.logger.log('Enough player to generate a game room');
    const newRoom: Room = new Room(uuidv4(), gameMap, players, ball);

    this.gameGateway.rooms.push(newRoom);
    this.logger.log(
      `Match between ${newRoom.players[0].username} & ${newRoom.players[1].username} in ${newRoom.uuid}`,
    );
    this.gameGatewayService.emitMatchFound(
      this.gameGateway.server,
      newRoom,
      newRoom.ball,
      newRoom.players,
    );
    newRoom.gameLoopInterval = this.gameCoreService.gameLoop(
      newRoom,
      this.gameGateway.rooms,
      this.gameGateway.server,
    );
  }
}
