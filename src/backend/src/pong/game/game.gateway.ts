import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MatchmakingGateway } from '../matchmaking/matchmaking.gateway';
import { Room } from '../class/room';
import { GameService } from './game.service';
import { Player } from '../class/player';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => MatchmakingGateway))
    private matchmakingGateway: MatchmakingGateway,
    private gameService: GameService,
  ) {}

  @WebSocketServer()
  server: Server;
  rooms: Room[] = [];

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

  @SubscribeMessage('move')
  movement(client: Socket, eventKey: string) {
    const gameRoom: Room = this.gameService.findRoomId(this.rooms, client);
    const player: Player = this.gameService.findPlayer(gameRoom, client);

    if (eventKey == 'ArrowDown') player.velocity = 1;
    else if (eventKey == 'ArrowUp') player.velocity = -1;
    else player.velocity = 0;
  }
}
