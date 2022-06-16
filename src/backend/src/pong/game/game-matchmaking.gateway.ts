import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';
import { v4 as uuidv4 } from 'uuid';
import { Room } from './room';
import { GameGateway } from './game.gateway';

@WebSocketGateway({ cors: true })
export class GameMatchmakingGateway {
  constructor(
    private gameService: GameService,
    private gameGateway: GameGateway,
  ) {}

  clientPool: Socket[] = [];
  rooms: Room[] = [];

  private logger: Logger = new Logger('GameMatchmMakingGateway');

  afterInit() {
    this.logger.log('Init');
  }

  @SubscribeMessage('joinNormalMatchmaking')
  joinMatchMaking(@ConnectedSocket() client: Socket) {
    for (const room of this.rooms) {
      if (room.players[0] === client || room.players[1] === client) {
        client.emit('alreadyInGame', 'You are already in a game');
        return;
      }
    }
    if (this.clientPool.findIndex((element) => element === client))
      this.clientPool.push(client);
    else {
      client.emit(
        'matchmakingAlreadyJoined',
        'You have already joined a matchmaking',
      );
      return;
    }
    this.rooms.forEach((element) => element.players[0] == client);
    this.logger.log(`A client has joined the matchmaking: ${client.id}`);
    if (this.clientPool.length > 1) this.generateGameRoom(this.clientPool);
    else client.emit('waitingForAMatch', 'Waiting for a match');
  }

  @SubscribeMessage('leaveNormalMatchmaking')
  leaveMatchmaking(@ConnectedSocket() client: Socket) {
    this.logger.log(`A client has left the matchmaking: ${client.id}`);
    if (this.clientPool.findIndex((element) => element === client) == 1) {
      this.clientPool.slice(
        this.clientPool.findIndex((element) => element === client),
        1,
      );
      client.emit('matchmakingLeft', 'You have left the matchmaking');
    }
  }

  @SubscribeMessage('leaveNormalGame')
  leaveGame(@ConnectedSocket() client: Socket) {
    for (const room of this.rooms) {
      if (room.players[0] === client || room.players[1] === client) {
        this.gameGateway.server
          .to(room.uuid)
          .emit('normalGameLeft', `player ${client.id} has left the game`);
        this.rooms.splice(
          this.rooms.findIndex((element) => element === room),
          1,
        );
        return;
      }
    }
  }

  private generateGameRoom(clientPool: Socket[]) {
    this.logger.log('Enough player to generate a game room');
    const newRoomId: string = uuidv4();
    const players: Socket[] = [clientPool.pop(), clientPool.pop()];
    const newRoom: Room = new Room(players, newRoomId);

    players[0].join(newRoomId);
    players[1].join(newRoomId);
    this.rooms.push(newRoom);
    this.gameGateway.server
      .to(newRoomId)
      .emit('matchFound', 'A match has been found', { roomId: newRoomId });
    this.clientPool.slice(
      this.clientPool.findIndex((element) => element === players[0]),
      1,
    );
    this.clientPool.slice(
      this.clientPool.findIndex((element) => element === players[1]),
      1,
    );
  }
}
