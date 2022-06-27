import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Room } from '../game/game-room';
import { GameGateway } from '../game/game.gateway';

@WebSocketGateway({ cors: true })
export class GameMatchmakingGateway {
  constructor(
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
  ) {}

  clientPool: Socket[] = [];

  private logger: Logger = new Logger('GameMatchMakingGateway');

  afterInit() {
    this.logger.log('Init');
  }

  @SubscribeMessage('joinNormalMatchmaking')
  joinMatchMaking(@ConnectedSocket() client: Socket) {
    for (const room of this.gameGateway.rooms) {
      if (room.players.includes(client)) {
        client.emit('error', 'You are already in a game');
        return;
      }
    }
    if (this.clientPool.includes(client) === false)
      this.clientPool.push(client);
    else {
      client.emit('error', 'You have already joined a matchmaking');
      return;
    }
    this.logger.log(`A client has joined the matchmaking: ${client.id}`);
    if (this.clientPool.length > 1) this.generateGameRoom(this.clientPool);
    else client.emit('waitingForAMatch', 'Waiting for a match');
  }

  @SubscribeMessage('leaveNormalMatchmaking')
  leaveMatchmaking(@ConnectedSocket() client: Socket) {
    if (this.clientPool.includes(client)) {
      this.clientPool.splice(
        this.clientPool.findIndex((element) => element === client),
        1,
      );
      this.logger.log('pool length after leave' + this.clientPool.length);
      this.logger.log(`A client has left the matchmaking: ${client.id}`);
      client.emit('matchmakingLeft', 'You have left the matchmaking');
    } else client.emit('error', 'You are not in a matchmaking');
  }

  @SubscribeMessage('leaveNormalGame')
  leaveGame(@ConnectedSocket() client: Socket) {
    for (const room of this.gameGateway.rooms) {
      if (room.players.includes(client)) {
        this.gameGateway.server
          .to(room.uuid)
          .emit('normalGameLeft', `player ${client.id} has left the game`);
        room.players[0].leave(room.uuid);
        room.players[1].leave(room.uuid);
        this.gameGateway.rooms.splice(
          this.gameGateway.rooms.findIndex((element) => element === room),
          1,
        );
        this.logger.log(`player ${client.id} has left the game ${room.uuid}`);
        return;
      }
    }
    client.emit('error', 'You are not in a game');
  }

  private async generateGameRoom(clientPool: Socket[]) {
    this.logger.log('Enough player to generate a game room');
    const newRoomId: string = uuidv4();
    const players: Socket[] = [clientPool.pop(), clientPool.pop()];
    const newRoom: Room = new Room(players, newRoomId);

    await players[0].join(newRoomId);
    await players[1].join(newRoomId);
    this.gameGateway.rooms.push(newRoom);
    this.logger.log(
      `Match between ${players[0].id} & ${players[1].id} in ${newRoomId}`,
    );
    this.gameGateway.server
      .to(newRoomId)
      .emit('matchFound', 'A match has been found', { roomId: newRoomId });
    this.gameGateway.server
      .to(newRoomId)
      .emit(
        'racketPosition',
        this.gameGateway.playerOnePos,
        this.gameGateway.playerTwoPos,
      );
  }
}
