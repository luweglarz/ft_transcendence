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
    for (const room of this.gameGateway.rooms) {
      if (
        room.players[0].socket === client ||
        room.players[1].socket === client
      ) {
        client.emit('error', 'You are already in a game');
        return;
      }
    }
    if (this.clientPool.includes(client) === false)
      this.clientPool.push(client);
    else {
      client.emit('error', 'You have already joined a matchmaking');
      return;
    }
    this.logger.log(`A client has joined the matchmaking: ${client.id}`);
    if (this.clientPool.length > 1)
      this.matchmakingService.generateGameRoom(this.clientPool);
    else client.emit('waitingForAMatch', 'Waiting for a match');
  }

  @SubscribeMessage('leaveNormalMatchmaking')
  leaveMatchmaking(@ConnectedSocket() client: Socket) {
    if (this.clientPool.includes(client)) {
      this.clientPool.splice(
        this.clientPool.findIndex((element) => element === client),
        1,
      );
      this.logger.log('pool length after leave' + this.clientPool.length);
      this.logger.log(`A client has left the matchmaking: ${client.id}`);
      client.emit('matchmakingLeft', 'You have left the matchmaking');
    } else client.emit('error', 'You are not in a matchmaking');
  }
}
