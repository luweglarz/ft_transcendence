import { Room } from 'src/pong/class/room/room';
import { Server } from 'socket.io';
import { GameMode } from 'src/pong/interface/game-mode.interface';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { Player } from '../../player/player';
import { Ball } from '../../ball/ball';

export class NormalGame implements GameMode {
  constructor(
    private _canvaHeight: number,
    private _canvaWidth: number,
    private _backgroundColor: string,
  ) {
    this._ball = new Ball(this, 4, 'white', 6);
  }

  private _ball: Ball;

  get canvaHeight(): number {
    return this._canvaHeight;
  }

  get canvaWidth(): number {
    return this._canvaWidth;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  get ball(): Ball {
    return this._ball;
  }

  emitGameUpdate(server: Server, gameRoom: Room, ball: Ball) {
    server.to(gameRoom.uuid).emit(
      'normalGameUpdate',
      { x: gameRoom.players[0].x, y: gameRoom.players[0].y },
      { x: gameRoom.players[1].x, y: gameRoom.players[1].y },
      { x: ball.x, y: ball.y },
      {
        playerOneGoals: gameRoom.players[0].goals,
        playerTwoGoals: gameRoom.players[1].goals,
      },
    );
  }

  movementHandler(eventKey: string, player: Player) {
    if (eventKey == 'ArrowDown') player.velocity = 1;
    else if (eventKey == 'ArrowUp') player.velocity = -1;
    else if (eventKey == 'stop') player.velocity = 0;
  }

  gameLoop(
    gameRoom: Room,
    rooms: Room[],
    server: Server,
    gameCoreService: GameCoreService,
  ): any {
    let scorer: Player;
    let winner: Player;
    let loser: Player;

    setTimeout(() => {
      this.ball.xVelocity = Math.round(Math.random()) * 2 - 1;
      this.ball.yVelocity = Math.round(Math.random()) * 2 - 1;
    }, 3000);

    const interval = setInterval(() => {
      gameCoreService.playersMovement(gameRoom);
      gameCoreService.ballMovement(gameRoom);
      if ((scorer = gameCoreService.checkGoal(gameRoom)) != undefined) {
        scorer.goals++;
        this.ball.resetBall(this);
      }
      winner = gameCoreService.checkWinner(gameRoom);
      if (winner != undefined) {
        loser = gameRoom.players.find(
          (element) => element.username != winner.username,
        );
        gameCoreService.gameFinished(
          server,
          gameRoom,
          rooms,
          winner,
          loser,
          false,
        );
      }
      this.emitGameUpdate(server, gameRoom, this.ball);
    }, 15);
    return interval;
  }
}
