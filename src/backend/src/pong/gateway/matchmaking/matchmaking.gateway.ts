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
    this.logger = new Logger('GameMatchMakingGateway');
  }
  private logger: Logger;

  afterInit() {
    this.logger.log('Init');
  }

  @SubscribeMessage('joinMatchmaking')
  joinMatchmaking(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameType: string,
  ) {
    if (this.matchmakingGatewayService.isClientInGame(client) === true) return;
    else if (
      this.matchmakingGatewayService.isClientInMatchmaking(client) === true
    )
      return;
    else this.matchmakingGatewayService.clientJoinMatchmaking(client, gameType);
  }

  @SubscribeMessage('leaveMatchmaking')
  leaveMatchmaking(@ConnectedSocket() client: Socket) {
    this.matchmakingGatewayService.clientLeaveMatchmaking(client);
  }
}
