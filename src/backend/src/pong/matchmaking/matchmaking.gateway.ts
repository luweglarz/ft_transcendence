import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameGateway } from '../game/game.gateway';
import { MatchmakingService } from './matchmaking.service';

@WebSocketGateway({ cors: true })
export class MatchmakingGateway {
  constructor(
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
    private matchmakingService: MatchmakingService,
  ) {}

  clientPool: Socket[] = [];

  private logger: Logger = new Logger('GameMatchMakingGateway');

  afterInit() {
    this.logger.log('Init');
  }

  @SubscribeMessage('joinNormalMatchmaking')
  joinMatchMaking(@ConnectedSocket() client: Socket) {
    if (this.matchmakingService.isClientInGame(client) === true) return;
    if (
      this.matchmakingService.isClientInMatchmaking(client, this.clientPool) ===
      false
    )
      this.clientPool.push(client);
    else {
      client.emit('error', 'You have already joined a matchmaking');
      return;
    }
    if (this.clientPool.length > 1) {
      console.log('roomplayer1 ', this.clientPool[0].handshake.auth.token);
      console.log('roomplayer1 ', this.clientPool[1].handshake.auth.token);
      console.log('client: ', client.handshake.auth.token);
      this.matchmakingService.generateGameRoom(this.clientPool);
    } else client.emit('waitingForAMatch', 'Waiting for a match');
  }

  @SubscribeMessage('leaveNormalMatchmaking')
  leaveMatchmaking(@ConnectedSocket() client: Socket) {
    if (this.clientPool.includes(client)) {
      this.clientPool.splice(
        this.clientPool.findIndex((element) => element === client),
        1,
      );
      this.logger.log(`A client has left the matchmaking: ${client.id}`);
      client.emit('matchmakingLeft', 'You have left the matchmaking');
    } else client.emit('error', 'You are not in a matchmaking');
  }
}
