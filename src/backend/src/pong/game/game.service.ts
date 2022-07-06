import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
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

  checkBorderCollision(playerInfos: Player): boolean {
    if (
      playerInfos.velocity == -1 &&
      playerInfos.y <= playerInfos.borderCollisionUp
    ) {
      playerInfos.y = playerInfos.borderCollisionUp;
      return true;
    } else if (
      playerInfos.velocity == 1 &&
      playerInfos.y >= playerInfos.borderCollisionDown
    ) {
      playerInfos.y = playerInfos.borderCollisionDown;
      return true;
    }
    return false;
  }

  gameLoop(players: Player[], gameRoom: Room, server: Server) {
    setInterval(() => {
      if (this.checkBorderCollision(players[0])) {
        players[0].velocity = 0;
      }
      if (this.checkBorderCollision(players[1])) {
        players[1].velocity = 0;
      }
      players[0].y += players[0].velocity * players[0].speed;
      players[1].y += players[1].velocity * players[1].speed;
      server
        .to(gameRoom.uuid)
        .emit(
          'gameUpdate',
          { x: players[0].x, y: players[0].y },
          { x: players[1].x, y: players[1].y },
        );
    }, 5);
  }
}
