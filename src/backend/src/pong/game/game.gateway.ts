import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private gameService: GameService) {}

  @WebSocketServer()
  server: Server;
  clients: Socket[] = [];
  rooms: number[] = [];

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients.push(client);
    this.logger.log('clientarray length ' + this.clients.length);
  }

  handleDisconnect(client: Socket) {
    this.clients.splice(
      this.clients.findIndex((element) => {
        element == client;
      }),
      1,
    );
    this.logger.log('clientarray length ' + this.clients.length);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createCustomGame')
  createCustomGame(client: Socket) {
    this.rooms.push(this.gameService.createGameRoom(client));
    this.logger.log('nb of rooms ' + client.rooms.size);
  }

  @SubscribeMessage('joinGameRoom')
  joinGameRoom(client: Socket, roomId: number) {
    client.join(this.rooms[roomId].toString());
    this.logger.log(
      `Client ${client.id} has joined the room nb ` +
        this.rooms[roomId].toString(),
    );
    client.emit('roomJoined');
  }
}
