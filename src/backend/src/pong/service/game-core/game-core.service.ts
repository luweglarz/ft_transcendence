import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Ball } from 'src/pong/class/ball/ball';
import { GameMap } from 'src/pong/class/game-map/game-map';
import { Player } from 'src/pong/class/player/player';
import { Room } from 'src/pong/class/room/room';
import { GameGatewayService } from 'src/pong/gateway/game/game-gateway.service';
import { GameGateway } from 'src/pong/gateway/game/game.gateway';

@Injectable()
export class GameCoreService {
  constructor(
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
    private gameGatewayService: GameGatewayService,
  ) {}

  gameLoopInterval: any;

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
      ball.speed += 0.1;
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
      this.gameGatewayService.emitGameFinished(
        server,
        gameRoom.uuid,
        players[0].username,
      );
      return true;
    } else if (players[1].goals == 11) {
      this.gameGatewayService.emitGameFinished(
        server,
        gameRoom.uuid,
        players[1].username,
      );
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

  gameLoop(gameRoom: Room, rooms: Room[], server: Server, ball: Ball) {
    let scorer: Player;

    setTimeout(() => {
      ball.xVelocity = Math.round(Math.random()) * 2 - 1;
      ball.yVelocity = Math.round(Math.random()) * 2 - 1;
    }, 3000);

    const interval = setInterval(() => {
      this.playersMovement(gameRoom.players);
      this.ballMovement(ball, gameRoom.players);
      if (
        (scorer = this.checkGoal(ball, gameRoom.gameMap, gameRoom.players)) !=
        undefined
      ) {
        scorer.goals++;
        ball.resetBall(gameRoom.gameMap);
      }
      if (this.checkWinner(gameRoom.players, server, gameRoom) == true) {
        this.gameGatewayService.clearRoom(gameRoom, rooms);
        clearInterval(interval);
      }
      this.gameGatewayService.emitGameUpdate(server, gameRoom, ball);
    }, 5);
    return interval;
  }
}
