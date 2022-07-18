import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Ball } from '../class/ball';
import { GameMap } from '../class/game-map';
import { Player } from '../class/player';
import { Room } from '../class/room';

@Injectable()
export class GameService {
  gameLoopInterval: any;

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

  private playersMovement(players: Player[]) {
    if (players[0].checkBorderCollision()) {
      players[0].velocity = 0;
    }
    if (players[1].checkBorderCollision()) {
      players[1].velocity = 0;
    }
    players[0].y += players[0].velocity * players[0].speed;
    players[1].y += players[1].velocity * players[1].speed;
  }

  private ballMovement(ball: Ball, players: Player[]) {
    if (ball.checkBorderCollision()) {
      if (ball.yVelocity == -1) ball.yVelocity = 1;
      else if (ball.yVelocity == 1) ball.yVelocity = -1;
    }
    if (ball.checkPaddleCollision(players)) {
      if (ball.xVelocity == -1) ball.xVelocity = 1;
      else if (ball.xVelocity == 1) ball.xVelocity = -1;
    }
    ball.x += ball.xVelocity * ball.speed;
    ball.y += ball.yVelocity * ball.speed;
  }

  private checkWinner(
    players: Player[],
    server: Server,
    gameRoom: Room,
  ): boolean {
    if (players[0].goals == 11) {
      server
        .to(gameRoom.uuid)
        .emit('gameFinished', { winner: players[0].socket.id });
      return true;
    } else if (players[1].goals == 11) {
      server
        .to(gameRoom.uuid)
        .emit('gameFinished', { winner: players[1].socket.id });
      return true;
    }
    return false;
  }

  private checkGoal(ball: Ball, gameMap: GameMap, players: Player[]): Player {
    if (ball.xVelocity == -1 && ball.x + ball.radius <= 0) return players[1];
    else if (ball.xVelocity == 1 && ball.x - ball.radius >= gameMap.canvaWidth)
      return players[0];
    return;
  }

  gameLoop(
    players: Player[],
    gameRoom: Room,
    rooms: Room[],
    server: Server,
    ball: Ball,
  ) {
    let scorer: Player;

    setTimeout(() => {
      ball.xVelocity = Math.round(Math.random()) * 2 - 1;
      ball.yVelocity = Math.round(Math.random()) * 2 - 1;
    }, 3000);

    const interval = setInterval(() => {
      this.playersMovement(players);
      this.ballMovement(ball, players);
      if (
        (scorer = this.checkGoal(ball, gameRoom.gameMap, players)) != undefined
      ) {
        scorer.goals++;
        ball.resetBall(gameRoom.gameMap);
      }
      if (this.checkWinner(players, server, gameRoom) == true) {
        this.clearRoom(gameRoom, rooms);
        clearInterval(interval);
      }
      server.to(gameRoom.uuid).emit(
        'gameUpdate',
        { x: players[0].x, y: players[0].y },
        { x: players[1].x, y: players[1].y },
        { x: ball.x, y: ball.y },
        {
          playerOneGoals: players[0].goals,
          playerTwoGoals: players[1].goals,
        },
      );
    }, 5);
    return interval;
  }
}
