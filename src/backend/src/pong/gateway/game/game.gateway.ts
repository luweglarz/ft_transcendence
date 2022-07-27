import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Room } from '../../class/room/room';
import { GameGatewayService } from './game-gateway.service';
import { Player } from '../../class/player/player';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gameGatewayService: GameGatewayService,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger('GameGateway');
    this._rooms = [];
  }

  @WebSocketServer()
  private _server: Server;
  private _rooms: Room[];

  private logger: Logger;

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
      this.logger.debug(error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.leaveGame(client);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('move')
  movement(@ConnectedSocket() client: Socket, @MessageBody() eventKey: string) {
    try {
      const gameRoom: Room = this.gameGatewayService.findRoomId(
        this.rooms,
        client,
      );
      const player: Player = this.gameGatewayService.findPlayer(
        gameRoom,
        client,
      );
      if (eventKey == 'ArrowDown') player.velocity = 1;
      else if (eventKey == 'ArrowUp') player.velocity = -1;
      else if (eventKey == 'stop') player.velocity = 0;
    } catch (error) {
      this.logger.debug(error);
    }
  }

  @SubscribeMessage('leaveGame')
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
          this.gameGatewayService.emitGameFinished(
            this.server,
            room.uuid,
            winner,
            leaver,
          );
          clearInterval(room.gameLoopInterval);
          this.gameGatewayService.clearRoom(room, this.rooms);
          this.logger.log(`player ${leaver} has left the game ${room.uuid}`);
          return;
        }
      }
    }
    client.emit('error', 'You are not in a game');
  }

  get rooms(): Room[] {
    return this._rooms;
  }

  get server(): Server {
    return this._server;
  }
}
