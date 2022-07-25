import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Ball } from 'src/pong/class/ball/ball';
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
    for (const player of room.players) {
      if (player.socket === client) return player;
    }
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

  emitGameFinished(
    server: Server,
    roomUuid: string,
    winner: string,
    leaver?: string,
  ) {
    server
      .to(roomUuid)
      .emit('gameFinished', { username: winner }, { username: leaver });
  }

  emitGameUpdate(server: Server, gameRoom: Room, ball: Ball) {
    server.to(gameRoom.uuid).emit(
      'gameUpdate',
      { x: gameRoom.players[0].x, y: gameRoom.players[0].y },
      { x: gameRoom.players[1].x, y: gameRoom.players[1].y },
      { x: ball.x, y: ball.y },
      {
        playerOneGoals: gameRoom.players[0].goals,
        playerTwoGoals: gameRoom.players[1].goals,
      },
    );
  }

  emitMatchFound(server: Server, newRoom: Room, ball: Ball, players: Player[]) {
    server.to(newRoom.uuid).emit(
      'matchFound',
      'A match has been found',
      {
        canvaHeight: newRoom.gameMap.canvaHeight,
        canvaWidth: newRoom.gameMap.canvaWidth,
        backgroundColor: newRoom.gameMap.backgroundColor,
        ballRadius: ball.radius,
        ballColor: ball.color,
      },
      {
        height: players[0].height,
        width: players[0].width,
        playerOneColor: players[0].color,
        playerTwoColor: players[1].color,
        playerOneUsername: players[0].username,
        playerTwoUsername: players[1].username,
      },
    );
  }
}
