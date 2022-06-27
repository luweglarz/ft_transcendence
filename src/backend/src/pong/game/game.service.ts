import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Room } from './game-room';

@Injectable()
export class GameService {
  constructor() {
    //todo
  }

  findRoomId(rooms: Room[], client: Socket): Room {
    for (const room of rooms) {
      if (room.players.includes(client)) {
        return room;
      }
    }
    return;
  }

  findPlayer(room: Room, client: Socket): number {
    if (room.players[0] === client) return 1;
    else if (room.players[1] === client) return 2;
  }
}
