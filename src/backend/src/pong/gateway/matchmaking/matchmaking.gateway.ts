import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Ball } from 'src/pong/class/ball/ball';
import { GameMap } from 'src/pong/class/game-map/game-map';
import { Player } from 'src/pong/class/player/player';
import { MatchmakingService } from './matchmaking-gateway.service';

@WebSocketGateway({ cors: true })
export class MatchmakingGateway {
  constructor(private matchmakingService: MatchmakingService) {}

  private normalClientPool: Socket[] = [];
  private logger: Logger = new Logger('GameMatchMakingGateway');

  afterInit() {
    this.logger.log('Init');
  }

  @SubscribeMessage('joinNormalMatchmaking')
  joinNormalMatchMaking(@ConnectedSocket() client: Socket) {
    if (this.matchmakingService.isClientInGame(client) === true) {
      client.emit('error', 'You are already in a game');
      return;
    } else if (
      this.matchmakingService.isClientInMatchmaking(
        client,
        this.normalClientPool,
      ) === true
    ) {
      client.emit('error', 'You have already joined a matchmaking');
      return;
    } else this.normalClientPool.push(client);

    if (this.normalClientPool.length > 1) {
      const gameMap: GameMap = new GameMap(525, 950, 'black');
      const players: Player[] = [
        new Player(gameMap, this.normalClientPool.pop(), 1, 3, 'white'),
        new Player(gameMap, this.normalClientPool.pop(), 2, 3, 'white'),
      ];
      const ball: Ball = new Ball(gameMap, 2, 'white', 6);
      this.matchmakingService.generateGameRoom(gameMap, ball, players);
    } else client.emit('waitingForAMatch', 'Waiting for a match');
  }

  @SubscribeMessage('leaveMatchmaking')
  leaveMatchmaking(@ConnectedSocket() client: Socket) {
    if (this.normalClientPool.includes(client)) {
      this.normalClientPool.splice(
        this.normalClientPool.findIndex((element) => element === client),
        1,
      );
      this.logger.log(`A client has left the matchmaking: ${client.id}`);
      client.emit('matchmakingLeft', 'You have left the matchmaking');
    } else client.emit('error', 'You are not in a matchmaking');
  }
}
