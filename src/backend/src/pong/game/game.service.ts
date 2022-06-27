import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Player } from '../class/player';
import { Room } from '../class/room';

@Injectable()
export class GameService {
  constructor() {
    //todo
  }

  findRoomId(rooms: Room[], client: Socket): Room {
    for (const room of rooms) {
      if (
        room.players[0].socket === client ||
        room.players[1].socket === client
      ) {
        return room;
      }
    }
    return;
  }

  findPlayer(room: Room, client: Socket): Player {
    if (room.players[0].socket === client) return room.players[0];
    else if (room.players[1].socket === client) return room.players[1];
  }
}
