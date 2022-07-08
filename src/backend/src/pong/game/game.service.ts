import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Ball } from '../class/ball';
import { GameMap } from '../class/game-map';
import { Player } from '../class/player';
import { Room } from '../class/room';

@Injectable()
export class GameService {
  constructor() {
    //todo
  }

  private interval: any;

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

  private checkGoal(ball: Ball, gameMap: GameMap, players: Player[]) {
    if (
      ball.xVelocity == -1 &&
      ball.x + ball.radius <= (gameMap.canvaWidth * 5) / 100 / 2
    ) {
      ball.resetBall(gameMap);
      players[1].goals += 1;
    } else if (
      ball.xVelocity == 1 &&
      ball.x - ball.radius >=
        (gameMap.canvaWidth * 5) / 100 / 2 + gameMap.borderWidth
    ) {
      ball.resetBall(gameMap);
      players[0].goals += 1;
    }
  }

  gameLoop(players: Player[], gameRoom: Room, server: Server, ball: Ball): any {
    ball.xVelocity = -1;
    ball.yVelocity = 1;

    const interval = setInterval(() => {
      this.playersMovement(players);
      this.ballMovement(ball, players);
      this.checkGoal(ball, gameRoom.gameMap, players);
      if (players[0].goals == 11) {
        server
          .to(gameRoom.uuid)
          .emit('gameFinished', { winner: players[0].socket.id });
        clearInterval(interval);
      } else if (players[1].goals == 11) {
        server
          .to(gameRoom.uuid)
          .emit('gameFinished', { winner: players[1].socket.id });
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
