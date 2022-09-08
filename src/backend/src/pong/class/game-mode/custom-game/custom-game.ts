import { Room } from 'src/pong/class/room/room';
import { Server } from 'socket.io';
import { GameMode } from 'src/pong/interface/game-mode.interface';
import { GameCoreService } from 'src/pong/service/game-core/game-core.service';
import { Player } from '../../player/player';
import { Ball } from '../../ball/ball';

export class CustomGame implements GameMode {
  constructor(
    private _canvaHeight: number,
    private _canvaWidth: number,
    private _backgroundColor: string,
  ) {
    this._ball = new Ball(this, 4, 'white', 10);
  }

  private _ball: Ball;
  private _gameType = 'custom';
  readonly boostCd: number = 5000;
  readonly boostDuration: number = 3000;

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

  get gameType(): string {
    return this._gameType;
  }

  emitGameUpdate(server: Server, gameRoom: Room, ball: Ball) {
    server.to(gameRoom.uuid).emit(
      'customGameUpdate',
      {
        x: gameRoom.players[0].x / this.canvaWidth,
        y: gameRoom.players[0].y / this.canvaHeight,
      },
      {
        x: gameRoom.players[1].x / this.canvaWidth,
        y: gameRoom.players[1].y / this.canvaHeight,
      },
      { x: ball.x / this.canvaWidth, y: ball.y / this.canvaHeight },
      {
        playerOneGoals: gameRoom.players[0].goals,
        playerTwoGoals: gameRoom.players[1].goals,
      },
      {
        player1Height: gameRoom.players[0].height,
        player2Height: gameRoom.players[1].height,
      },
      {
        player1Width: gameRoom.players[0].width,
        player2Width: gameRoom.players[1].width,
      },
      {
        player1Cd: gameRoom.players[0].boostCd,
        player2Cd: gameRoom.players[1].boostCd,
      },
    );
  }

  paddleSpeedBoost(player: Player) {
    player.boostCd = this.boostCd;
    player.speed *= 1.5;
    setTimeout(() => {
      player.speed = player.initialSpeed;
      const cdInterval = setInterval(() => {
        player.boostCd -= 1;
        if (player.boostCd <= 0) {
          player.boostCd = 0;
          clearInterval(cdInterval);
        }
      }, 1);
    }, this.boostDuration);
  }

  movementHandler(eventKey: string, player: Player) {
    if (eventKey == 'ArrowDown') player.velocity = 1;
    else if (eventKey == 'ArrowUp') player.velocity = -1;
    else if (eventKey == ' ' && player.boostCd === 0)
      this.paddleSpeedBoost(player);
    else if (eventKey == 'stop') player.velocity = 0;
  }

  private reduceScorerSize(scorer: Player) {
    scorer.height -= (5 * 110) / 100;
    scorer.width -= (1 * 110) / 100;
    scorer.borderCollisionUp = Math.round((this.canvaHeight * 2) / 100);
    scorer.borderCollisionDown = Math.round(
      this.canvaHeight -
        Math.round((this.canvaHeight * 2) / 100) -
        scorer.height,
    );
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
        this.reduceScorerSize(scorer);
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
