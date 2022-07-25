import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MatchmakingService } from './matchmaking-gateway.service';

@WebSocketGateway({ cors: true })
export class MatchmakingGateway {
  constructor(private matchmakingService: MatchmakingService) {}

  private clientPool: Socket[] = [];
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
      this.matchmakingService.isClientInMatchmaking(client, this.clientPool) ===
      true
    ) {
      client.emit('error', 'You have already joined a matchmaking');
      return;
    } else this.clientPool.push(client);

    if (this.clientPool.length > 1)
      this.matchmakingService.generateNormalGameRoom(this.clientPool);
    else client.emit('waitingForAMatch', 'Waiting for a match');
  }

  @SubscribeMessage('leaveMatchmaking')
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
