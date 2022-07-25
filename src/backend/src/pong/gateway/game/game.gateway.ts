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
import { Room } from '../../class/room/room';
import { GameGatewayService } from './game-gateway.service';
import { Player } from '../../class/player/player';
import { JwtService } from '@nestjs/jwt';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gameGatewayService: GameGatewayService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => GameCoreService))
    private gameCoreService: GameCoreService,
  ) {}

  @WebSocketServer()
  server: Server;
  rooms: Room[] = [];

  private logger: Logger = new Logger('GameGateway');

  afterInit() {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    try {
      this.jwtService.verify(client.handshake.auth.token, {
        secret: process.env['JWT_SECRET'],
      });
      this.logger.log(`Client connected: ${client.id}`);
    } catch (error) {
      this.logger.log(error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.leaveGame(client);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('move')
  movement(client: Socket, eventKey: string) {
    const gameRoom: Room = this.gameGatewayService.findRoomId(this.rooms, client);
    const player: Player = this.gameGatewayService.findPlayer(gameRoom, client);

    if (eventKey == 'ArrowDown') player.velocity = 1;
    else if (eventKey == 'ArrowUp') player.velocity = -1;
    else if (eventKey == 'stop') player.velocity = 0;
  }

  @SubscribeMessage('leaveNormalGame')
  leaveGame(@ConnectedSocket() client: Socket) {
    let winner: string;
    let leaver: string;

    for (const room of this.rooms) {
      for (const player of room.players) {
        if (
          player.socket.handshake.auth.token === client.handshake.auth.token
        ) {
          winner = room.players.find(
            (element) =>
              element.socket.handshake.auth.token !=
              client.handshake.auth.token,
          ).username;
          leaver = room.players.find(
            (element) =>
              element.socket.handshake.auth.token ==
              client.handshake.auth.token,
          ).username;
          this.server
            .to(room.uuid)
            .emit('normalGameLeft', `player ${leaver} has left the game`);
          this.server
            .to(room.uuid)
            .emit('gameFinished', { username: winner }, { username: leaver });
          this.gameGatewayService.clearRoom(room, this.rooms);
          clearInterval(this.gameCoreService.gameLoopInterval);
          this.logger.log(`player ${leaver} has left the game ${room.uuid}`);
          return;
        }
      }
    }

    client.emit('error', 'You are not in a game');
  }
}
