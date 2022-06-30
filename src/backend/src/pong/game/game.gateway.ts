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
    const initialPos = player.y;
    if (eventKey == 'ArrowDown') {
    if (player.y + 20 > 395) player.y = 395;
    else {
      clearInterval(upInterval);
      var downInterval = setInterval( () => {
      if (player.y >= initialPos + 20)
        clearInterval(downInterval);
      player.y += 2;
    }, 10)}
    } else if (eventKey == 'ArrowUp') {
    if (player.y - 20 < 20) player.y = 20;
    else  {
      clearInterval(downInterval);
      var upInterval = setInterval( () => {
      if (player.y <= initialPos - 20)
        clearInterval(upInterval);
      player.y -= 2;
    }, 10)}
    }
  }
}