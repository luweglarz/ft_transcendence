import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
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
    this.leaveGame(client);
    this.matchmakingGateway.leaveMatchmaking(client);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('move')
  movement(client: Socket, eventKey: string) {
    const gameRoom: Room = this.gameService.findRoomId(this.rooms, client);
    const player: Player = this.gameService.findPlayer(gameRoom, client);

    if (eventKey == 'ArrowDown') player.velocity = 1;
    else if (eventKey == 'ArrowUp') player.velocity = -1;
    else if (eventKey == 'stop') player.velocity = 0;
  }

  @SubscribeMessage('leaveNormalGame')
  leaveGame(@ConnectedSocket() client: Socket) {
    let winner: Player;
    for (const room of this.rooms) {
      if (
        room.players[0].socket === client ||
        room.players[1].socket === client
      ) {
        winner = room.players.find((element) => element.socket.id != client.id);
        this.server
          .to(room.uuid)
          .emit('normalGameLeft', `player ${client.id} has left the game`);
        this.server
          .to(room.uuid)
          .emit(
            'gameFinished',
            { winner: winner.socket.id },
            { Leaver: client.id },
          );
        this.gameService.clearRoom(room, this.rooms);
        clearInterval(this.gameService.gameLoopInterval);
        this.logger.log(`player ${client.id} has left the game ${room.uuid}`);
        return;
      }
    }
    client.emit('error', 'You are not in a game');
  }
}
