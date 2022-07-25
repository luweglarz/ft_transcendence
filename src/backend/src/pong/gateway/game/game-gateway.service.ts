import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Player } from '../../class/player/player';
import { Room } from '../../class/room/room';

@Injectable()
export class GameGatewayService {
  findRoomId(rooms: Room[], client: Socket): Room {
    for (const room of rooms) {
      for (const player of room.players) {
        if (player.socket === client) return room;
      }
    }
    return;
  }

  findPlayer(room: Room, client: Socket): Player {
    try {
      for (const player of room.players) {
        if (player.socket === client) return player;
      }
    } catch {}
    return;
  }

  clearRoom(roomToClear: Room, rooms: Room[]) {
    roomToClear.players[0].socket.leave(roomToClear.uuid);
    roomToClear.players[1].socket.leave(roomToClear.uuid);
    rooms.splice(
      rooms.findIndex((element) => element === roomToClear),
      1,
    );
  }
}
