import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../../class/player/player';
import { Room } from '../../class/room/room';
import { GameGateway } from '../game/game.gateway';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { GameGatewayService } from '../game/game-gateway.service';
import { GameMode } from 'src/pong/interface/game-mode.interface';
import { NormalGame } from 'src/pong/class/game-mode/normal-game/normal-game';
import { CustomGame } from 'src/pong/class/game-mode/custom-game/custom-game';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { ConnectedSocket } from '@nestjs/websockets';

@Injectable()
export class MatchmakingGatewayService {
  constructor(
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
    private gameCoreService: GameCoreService,
    private gameGatewayService: GameGatewayService,
    private jwtService: JwtAuthService,
  ) {
    this.normalClientPool = [];
    this.pools = [];
    this.pools.push(this.normalClientPool);
    this.pools.push(this.rankedClientPool);
    this.pools.push(this.customClientPool);
  }

  private pools: Socket[][];
  private normalClientPool: Socket[] = [];
  private rankedClientPool: Socket[] = [];
  private customClientPool: Socket[] = [];

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

  isUserInGame(username: string): boolean {
    for (const room of this.gameGateway.rooms) {
      for (const player of room.players) {
        if (username === player.username) return true;
      }
    }
    return false;
  }

  isClientInMatchmaking(@ConnectedSocket() client: Socket): boolean {
    for (const pool of this.pools) {
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

  clientJoinMatchmaking(client: Socket, gameType: string) {
    if (gameType === 'normal') {
      this.pools[0].push(client);
      client.emit('waitingForAMatch', 'Waiting for a normal match');
      if (this.pools[0].length > 1) this.createGame(this.pools[0], gameType);
    } else if (gameType === 'ranked') {
      this.pools[1].push(client);
      client.emit('waitingForAMatch', 'Waiting for a ranked match');
      if (this.pools[1].length > 1) this.createGame(this.pools[1], gameType);
    } else if (gameType === 'custom') {
      this.pools[2].push(client);
      client.emit('waitingForAMatch', 'Waiting for a custom match');
      if (this.pools[2].length > 1) this.createGame(this.pools[2], gameType);
    }
  }

  clientLeaveMatchmaking(client: Socket) {
    for (const pool of this.pools) {
      for (const clientToken of pool) {
        if (clientToken.handshake.auth.token === client.handshake.auth.token) {
          pool.splice(
            pool.findIndex((element) => element === client),
            1,
          );
          this.logger.log(`A client has left the matchmaking: ${client.id}`);
          client.emit('matchmakingLeft', 'You have left the matchmaking');
          return;
        }
      }
    }
    client.emit('error', 'You are not in a matchmaking');
  }

  createGame(clientPool: Socket[], gameType: string) {
    let gameMode: GameMode;
    let players: Player[];

    if (gameType == 'normal') {
      gameMode = new NormalGame(525, 950, 'black', gameType);
      players = [
        new Player(gameMode, clientPool.pop(), 1, 7, 'white'),
        new Player(gameMode, clientPool.pop(), 2, 7, 'white'),
      ];
    } else if (gameType == 'ranked') {
      gameMode = new NormalGame(525, 950, 'black', gameType);
      players = [
        new Player(gameMode, clientPool.pop(), 1, 6, 'white'),
        new Player(gameMode, clientPool.pop(), 2, 6, 'white'),
      ];
    } else if (gameType == 'custom') {
      gameMode = new CustomGame(525, 950, 'black');
      players = [
        new Player(gameMode, clientPool.pop(), 1, 6, 'white'),
        new Player(gameMode, clientPool.pop(), 2, 6, 'white'),
      ];
    }
    this.generateGameRoom(gameMode, players);
  }

  private generateGameRoom(gameMode: GameMode, players: Player[]) {
    this.logger.log('Enough player to generate a game room');
    const newRoom: Room = new Room(uuidv4(), gameMode, players);

    this.gameGateway.rooms.push(newRoom);
    this.logger.log(
      `Match between ${newRoom.players[0].username} & ${newRoom.players[1].username} in ${newRoom.uuid}`,
    );
    this.gameGatewayService.emitMatchFound(this.gameGateway.server, newRoom);
    newRoom.gameLoopInterval = newRoom.gameMode.gameLoop(
      newRoom,
      this.gameGateway.rooms,
      this.gameGateway.server,
      this.gameCoreService,
    );
  }
}
