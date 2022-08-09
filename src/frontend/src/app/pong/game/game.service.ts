import { ElementRef, Injectable } from '@angular/core';
import { Ball } from '../class/ball';
import { CustomGame } from '../class/game-mode/custom-game';
import { GameSocket } from '../class/game-socket';
import { Player } from '../class/player';
import { GameMode } from '../interface/game-mode';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private _socket: GameSocket) {
    this.isInGame = false;
    this.keyPressed = '';
  }

  public isInGame: boolean;
  public keyPressed: string;
  public keyEventsInterval: any;

  private boostOneContext: any;
  private boostTwoContext: any;

  get socket(): GameSocket {
    return this._socket;
  }

  isCustomGame(game: GameMode): boolean {
    return game instanceof CustomGame ? true : false;
  }

  requestLeaveGame() {
    this.isInGame = false;
    this.socket.emit('leaveGame');
  }

  sendKeyEvents() {
    this.keyEventsInterval = setInterval(() => {
      this.socket.emit('move', this.keyPressed);
    }, 25);
  }

  clearCanvas(gameCanvas: ElementRef, gameContext: any) {
    gameContext.clearRect(
      0,
      0,
      gameCanvas.nativeElement.width,
      gameCanvas.nativeElement.height,
    );
  }

  fillBackground(gameContext: any, gameInfos: GameMode) {
    gameContext.fillStyle = gameInfos.backgroundColor;
    gameContext.fillRect(0, 0, gameInfos.canvaWidth, gameInfos.canvaHeight);
  }

  drawMiddleline(gameContext: any, gameInfos: GameMode) {
    gameContext.lineWidth = 5;
    gameContext.beginPath();
    gameContext.moveTo(Math.round(gameInfos.canvaWidth / 2), 0);
    gameContext.lineTo(
      Math.round(gameInfos.canvaWidth / 2),
      gameInfos.canvaHeight,
    );
    gameContext.strokeStyle = 'white';
    gameContext.stroke();
  }

  drawPaddle(gameContext: any, player: Player) {
    gameContext.fillStyle = player.color;
    gameContext.fillRect(player.x, player.y, player.width, player.height);
  }

  drawBall(gameContext: any, ball: Ball) {
    gameContext.beginPath();
    gameContext.fillStyle = ball.color;
    gameContext.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    gameContext.fill();
    gameContext.stroke();
  }

  drawScore(gameContext: any, gameInfos: GameMode) {
    gameContext.beginPath();
    gameContext.font = '50px impact';
    gameContext.fillText(
      String(gameInfos.players[0].goals),
      (gameInfos.canvaWidth * 5) / 100 / 2 + gameInfos.canvaWidth / 2 / 2,
      50,
    );
    gameContext.fillText(
      String(gameInfos.players[1].goals),
      (gameInfos.canvaWidth * 5) / 100 / 2 +
        gameInfos.canvaWidth / 2 +
        gameInfos.canvaWidth / 6,
      50,
    );
  }

  drawPlayersInfos(
    playerOneInfo: ElementRef,
    playerTwoInfo: ElementRef,
    players: Player[],
  ) {
    playerOneInfo.nativeElement.innerHTML += players[0].username;
    playerTwoInfo.nativeElement.innerHTML += players[1].username;
  }

  setBoostContext(boostOne: ElementRef, boostTwo: ElementRef) {
    this.boostOneContext = boostOne.nativeElement.getContext('2d');
    this.boostTwoContext = boostTwo.nativeElement.getContext('2d');
  }

  drawBoost(players: Player[], boostOne: ElementRef, boostTwo: ElementRef) {
    this.boostOneContext.clearRect(
      0,
      0,
      boostOne.nativeElement.width,
      boostOne.nativeElement.height,
    );
    this.boostTwoContext.clearRect(
      0,
      0,
      boostTwo.nativeElement.width,
      boostTwo.nativeElement.height,
    );
    console.log(
      'native eleenmt width height : ',
      boostOne.nativeElement.width + ' , ',
      boostOne.nativeElement.height,
    );
    this.boostOneContext.fillStyle = 'red';
    this.boostTwoContext.fillStyle = 'red';
    const boostOneRatio = Math.abs((players[0].boostCd / 5000) * 100 - 100);
    this.boostOneContext.fillRect(0, 0, (boostOneRatio * 300) / 100, 150);
    const boostTwoRatio = Math.abs((players[1].boostCd / 5000) * 100 - 100);
    this.boostTwoContext.fillRect(0, 0, (boostTwoRatio * 300) / 100, 150);
  }
}
