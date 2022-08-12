import { ElementRef } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../../game/game.service';
import { GameMode } from '../../interface/game-mode';
import { Ball } from '../ball';
import { Player } from '../player';

export class CustomGame implements GameMode {
  constructor(
    private _canvaHeight: number,
    private _canvaWidth: number,
    private _backgroundColor: string,
    private _players: Player[],
    private _ball: Ball,
    private gameService: GameService,
  ) {}

  private gameContext: any;
  private boostOneContext: any;
  private boostTwoContext: any;
  private boostSize = {
    width: 0,
    height: 0,
  };

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
  ) {
    this.gameContext = gameContext;
    this.boostSize.width = boostOneRef.nativeElement.width;
    this.boostSize.height = boostOneRef.nativeElement.height;
    this.boostOneContext = boostTwoRef.nativeElement.getContext('2d');
    this.boostTwoContext = boostTwoRef.nativeElement.getContext('2d');
  }

  onGameUpdate(socket: Socket) {
    socket.on(
      'customGameUpdate',
      (
        player1Pos: any,
        player2Pos: any,
        ballPos: any,
        score: any,
        playerHeights?: any,
        playerWidth?: any,
        playersCd?: any,
      ) => {
        this.players[0].x = player1Pos.x;
        this.players[0].y = player1Pos.y;
        this.players[1].x = player2Pos.x;
        this.players[1].y = player2Pos.y;
        this.ball.x = ballPos.x;
        this.ball.y = ballPos.y;
        this.players[0].goals = score.playerOneGoals;
        this.players[1].goals = score.playerTwoGoals;
        this.players[0].height = playerHeights.player1Height;
        this.players[1].height = playerHeights.player2Height;
        this.players[0].width = playerWidth.player1Width;
        this.players[1].width = playerWidth.player2Width;
        this.players[0].boostCd = playersCd.player1Cd;
        this.players[1].boostCd = playersCd.player2Cd;
      },
    );
  }

  clearCanvas(): void {
    this.gameContext.clearRect(0, 0, this.canvaWidth, this.canvaHeight);
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
    this.gameContext.beginPath();
    this.gameContext.fillStyle = this.ball.color;
    this.gameContext.arc(
      this.ball.x,
      this.ball.y,
      this.ball.radius,
      0,
      2 * Math.PI,
    );
    this.gameContext.fill();
    this.gameContext.stroke();
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

  drawBoost() {
    this.boostOneContext.clearRect(
      0,
      0,
      this.boostSize.width,
      this.boostSize.height,
    );
    this.boostTwoContext.clearRect(
      0,
      0,
      this.boostSize.width,
      this.boostSize.height,
    );
    this.boostOneContext.fillStyle = 'red';
    this.boostTwoContext.fillStyle = 'red';
    const boostOneRatio = Math.abs(
      (this.players[0].boostCd / 5000) * 100 - 100,
    );
    this.boostOneContext.fillRect(
      0,
      0,
      (boostOneRatio * 300) / 100,
      this.boostSize.height,
    );
    const boostTwoRatio = Math.abs(
      (this.players[1].boostCd / 5000) * 100 - 100,
    );
    this.boostTwoContext.fillRect(
      0,
      0,
      (boostTwoRatio * 300) / 100,
      this.boostSize.height,
    );
  }

  gameLoop: FrameRequestCallback = () => {
    if (this.gameService.isInGame === false) return;
    this.clearCanvas();
    this.fillBackground();
    this.drawPaddles();
    this.drawBall();
    this.drawScore();
    this.drawBoost();
    requestAnimationFrame(this.gameLoop);
  };
}
