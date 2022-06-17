import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameMatchmakingGateway } from '../matchmaking/game-matchmaking.gateway';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(@Inject(forwardRef(() => GameMatchmakingGateway))private matchmakingGateway: GameMatchmakingGateway) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('GameGateway');

  afterInit() {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.matchmakingGateway.leaveGame(client);
    this.matchmakingGateway.leaveMatchmaking(client);
    this.logger.log(`Client disconnected: ${client.id}`);

  }
}
