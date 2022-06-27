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
import { GameMatchmakingGateway } from '../matchmaking/game-matchmaking.gateway';
import { Room } from './game-room';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => GameMatchmakingGateway))
    private matchmakingGateway: GameMatchmakingGateway,
    private gameService: GameService,
  ) {}

  playerOnePos = {
    x: 0,
    y: 225,
  };

  playerTwoPos = {
    x: 570,
    y: 225,
  };

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
    const player: number = this.gameService.findPlayer(gameRoom, client);
    if (eventKey == 'ArrowDown' && player == 1) this.playerOnePos.y += 15;
    else if (eventKey == 'ArrowUp' && player == 1) this.playerOnePos.y -= 15;
    else if (eventKey == 'ArrowDown' && player == 2) this.playerTwoPos.y += 15;
    else if (eventKey == 'ArrowUp' && player == 2) this.playerTwoPos.y -= 15;
    this.server
      .to(gameRoom.uuid)
      .emit('racketPosition', this.playerOnePos, this.playerTwoPos);
  }
}
