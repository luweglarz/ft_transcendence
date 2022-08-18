import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Player } from 'src/pong/class/player/player';
import { Room } from 'src/pong/class/room/room';
import { GameGatewayService } from 'src/pong/gateway/game/game-gateway.service';
import { GameDbService } from '../game-db/game-db.service';

@Injectable()
export class GameCoreService {
  constructor(
    private gameGatewayService: GameGatewayService,
    private gameDbService: GameDbService,
  ) {}

  gameFinished(
    server: Server,
    gameRoom: Room,
    rooms: Room[],
    winner: Player,
    loser: Player,
    gameLeft: boolean,
  ) {
    this.gameDbService.pushGameDb(winner, loser, gameRoom.gameMode.gameType);
    if (gameLeft === false)
      this.gameGatewayService.emitGameFinished(
        server,
        gameRoom.uuid,
        winner.username,
      );
    else if (gameLeft === true)
      this.gameGatewayService.emitGameFinished(
        server,
        gameRoom.uuid,
        winner.username,
        loser.username,
      );
    clearInterval(gameRoom.gameLoopInterval);
    this.gameGatewayService.clearRoom(gameRoom, rooms);
  }

  playersMovement(gameRoom: Room) {
    if (gameRoom.players[0].checkBorderCollision()) {
      gameRoom.players[0].velocity = 0;
    }
    if (gameRoom.players[1].checkBorderCollision()) {
      gameRoom.players[1].velocity = 0;
    }
    gameRoom.players[0].y +=
      gameRoom.players[0].velocity * gameRoom.players[0].speed;
    gameRoom.players[1].y +=
      gameRoom.players[1].velocity * gameRoom.players[1].speed;
  }

  ballMovement(gameRoom: Room) {
    if (gameRoom.gameMode.ball.checkBorderCollision()) {
      if (gameRoom.gameMode.ball.yVelocity == -1)
        gameRoom.gameMode.ball.yVelocity = 1;
      else if (gameRoom.gameMode.ball.yVelocity == 1)
        gameRoom.gameMode.ball.yVelocity = -1;
    }
    if (gameRoom.gameMode.ball.checkPaddleCollision(gameRoom.players)) {
      if (gameRoom.gameMode.ball.xVelocity == -1)
        gameRoom.gameMode.ball.xVelocity = 1;
      else if (gameRoom.gameMode.ball.xVelocity == 1)
        gameRoom.gameMode.ball.xVelocity = -1;
      gameRoom.gameMode.ball.speed += 0.1;
    }
    gameRoom.gameMode.ball.x +=
      gameRoom.gameMode.ball.xVelocity * gameRoom.gameMode.ball.speed;
    gameRoom.gameMode.ball.y +=
      gameRoom.gameMode.ball.yVelocity * gameRoom.gameMode.ball.speed;
  }

  checkWinner(gameRoom: Room): Player {
    if (gameRoom.players[0].goals == 11) return gameRoom.players[0];
    else if (gameRoom.players[1].goals == 11) return gameRoom.players[1];
    else return undefined;
  }

  checkGoal(gameRoom: Room): Player {
    if (
      gameRoom.gameMode.ball.xVelocity == -1 &&
      gameRoom.gameMode.ball.x + gameRoom.gameMode.ball.radius <= 0
    )
      return gameRoom.players[1];
    else if (
      gameRoom.gameMode.ball.xVelocity == 1 &&
      gameRoom.gameMode.ball.x - gameRoom.gameMode.ball.radius >=
        gameRoom.gameMode.canvaWidth
    )
      return gameRoom.players[0];
    return;
  }
}
