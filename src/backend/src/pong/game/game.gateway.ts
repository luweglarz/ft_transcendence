import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  clients: Socket[] = [];

  private logger: Logger = new Logger('gameRoomGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    //should create a data structure for the user
    this.clients.push(client);
    this.logger.log('clientarray length after connect ' + this.clients.length);
  }

  handleDisconnect(client: Socket) {
    this.clients.splice(
      this.clients.findIndex((element) => {
        element == client;
      }),
      1,
    );
    this.logger.log(
      'clientarray length after disconnect ' + this.clients.length,
    );
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
