import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MatchmakingGatewayService } from './matchmaking-gateway.service';

@WebSocketGateway({ cors: true, path: '/pong' })
export class MatchmakingGateway {
  constructor(private matchmakingGatewayService: MatchmakingGatewayService) {
    this.normalClientPool = [];
    this.pools = [];
    this.pools.push(this.normalClientPool);
    this.pools.push(this.customClientPool);
    this.logger = new Logger('GameMatchMakingGateway');
  }

  private pools: Socket[][];
  private normalClientPool: Socket[] = [];
  private customClientPool: Socket[] = [];
  private logger: Logger;

  afterInit() {
    this.logger.log('Init');
  }

  @SubscribeMessage('joinMatchmaking')
  joinMatchmaking(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameType: string,
  ) {
    if (this.matchmakingGatewayService.isClientInGame(client) === true) {
      client.emit('error', 'You are already in a game');
      return;
    } else if (
      this.matchmakingGatewayService.isClientInMatchmaking(
        client,
        this.pools,
      ) === true
    ) {
      client.emit('error', 'You have already joined a matchmaking');
      return;
    } else
      this.matchmakingGatewayService.clientJoinMatchmaking(
        client,
        this.pools,
        gameType,
      );
  }

  @SubscribeMessage('leaveMatchmaking')
  leaveMatchmaking(@ConnectedSocket() client: Socket) {
    this.matchmakingGatewayService.clientLeaveMatchmaking(client, this.pools);
  }
}
