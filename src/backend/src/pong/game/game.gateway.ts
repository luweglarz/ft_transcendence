import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
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
import { v4 as uuidv4 } from "uuid"
import { Room } from './room';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private gameService: GameService) {}

  @WebSocketServer()
  server: Server;
  clientPool: Socket[] = [];
  rooms: Room[] = [];

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinNormalMatchmaking')
  joinMatchMaking(@ConnectedSocket()client: Socket) {
    this.logger.log("A client has joined the matchmaking");
    //check if client is already in matchmaking
    this.clientPool.push(client);
    if (this.clientPool.length > 1)
      this.generateGameRoom(this.clientPool);
    else
      client.emit("waitingForOpponent");

  }

  generateGameRoom(clientPool: Socket[]){
    this.logger.log("Enough player to generate a game room");
    //check uuid already exist and if players are already in a game 
    const newRoomId: string = uuidv4();
    const players: Socket[] = [clientPool.pop(), clientPool.pop()]
    
    players[0].join(newRoomId);
    players[1].join(newRoomId);
    this.rooms.push(new Room(players, newRoomId));
    this.server.to(newRoomId).emit('matchFound', { roomId: newRoomId});
  }
}
