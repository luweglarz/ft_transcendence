import { Directive, ElementRef } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../../game/game.service';
import { GameMode } from '../../interface/game-mode';
import { Ball } from '../ball';
import { Player } from '../player';

@Directive()
export class NormalGame implements GameMode {
  constructor(
    private _canvaHeight: number,
    private _canvaWidth: number,
    private _backgroundColor: string,
    private _players: Player[],
    private _ball: Ball,
    private gameService: GameService,
  ) {}

  private gameContext: any;

  get canvaHeight(): number {
    return this._canvaHeight;
  }
  get canvaWidth(): number {
    return this._canvaWidth;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  get players(): Player[] {
    return this._players;
  }

  get ball(): Ball {
    return this._ball;
  }

  setDrawUtilities(
    gameContext: any,
    boostOneRef: ElementRef,
    boostTwoRef: ElementRef,
  ): void {
    this.gameContext = gameContext;
    boostOneRef;
    boostTwoRef;
  }

  onGameUpdate(socket: Socket) {
    socket.on(
      'normalGameUpdate',
      (player1Pos: any, player2Pos: any, ballPos: any, score: any) => {
        this.players[0].x = player1Pos.x;
        this.players[0].y = player1Pos.y;
        this.players[1].x = player2Pos.x;
        this.players[1].y = player2Pos.y;
        this.ball.x = ballPos.x;
        this.ball.y = ballPos.y;
        this.players[0].goals = score.playerOneGoals;
        this.players[1].goals = score.playerTwoGoals;
      },
    );
  }

  fillBackground(): void {
    this.gameContext.fillStyle = this.backgroundColor;
    this.gameContext.fillRect(0, 0, this.canvaWidth, this.canvaHeight);
  }

  drawPaddles(): void {
    this.gameContext.beginPath();
    this.gameContext.fillStyle = this.players[0].color;
    this.gameContext.fillRect(
      this.players[0].x,
      this.players[0].y,
      this.players[0].width,
      this.players[0].height,
    );
    this.gameContext.closePath();
    this.gameContext.beginPath();
    this.gameContext.fillStyle = this.players[1].color;
    this.gameContext.fillRect(
      this.players[1].x,
      this.players[1].y,
      this.players[1].width,
      this.players[1].height,
    );
    this.gameContext.closePath();
  }

  drawBall(): void {
    this.gameContext.fillStyle = this.ball.color;
    this.gameContext.fillRect(
      this.ball.x - this.ball.radius,
      this.ball.y - this.ball.radius,
      this.ball.radius * 2,
      this.ball.radius * 2,
    );
  }

  drawScore(): void {
    this.gameContext.beginPath();
    this.gameContext.font = '50px impact';
    this.gameContext.fillText(
      String(this.players[0].goals),
      (this.canvaWidth * 5) / 100 / 2 + this.canvaWidth / 2 / 2,
      50,
    );
    this.gameContext.fillText(
      String(this.players[1].goals),
      (this.canvaWidth * 5) / 100 / 2 +
        this.canvaWidth / 2 +
        this.canvaWidth / 6,
      50,
    );
  }

  drawMiddleline() {
    this.gameContext.lineWidth = 5;
    this.gameContext.beginPath();
    this.gameContext.moveTo(Math.round(this.canvaWidth / 2), 0);
    this.gameContext.lineTo(Math.round(this.canvaWidth / 2), this.canvaHeight);
    this.gameContext.strokeStyle = 'white';
    this.gameContext.stroke();
  }

  gameLoop: FrameRequestCallback = () => {
    if (this.gameService.isInGame === false) return;
    this.fillBackground();
    this.drawMiddleline();
    this.drawPaddles();
    this.drawBall();
    this.drawScore();
    requestAnimationFrame(this.gameLoop);
  };
}
