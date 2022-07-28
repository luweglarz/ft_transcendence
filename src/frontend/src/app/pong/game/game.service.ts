import { ElementRef, Injectable } from '@angular/core';
import { AuthSocket } from 'src/app/class/auth-socket';
import { Ball } from '../class/ball';
import { Game } from '../class/game';
import { Player } from '../class/player';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private _socket: AuthSocket) {
    this.isInGame = false;
    this.keyPressed = '';
  }

  public isInGame;
  public keyPressed: string;
  public keyEventsInterval: any;

  get socket(): AuthSocket {
    return this._socket;
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

  fillBackground(gameContext: any, gameInfos: Game) {
    gameContext.fillStyle = gameInfos.backgroundColor;
    gameContext.fillRect(0, 0, gameInfos.canvaWidth, gameInfos.canvaHeight);
  }

  drawMiddleline(gameContext: any, gameInfos: Game) {
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

  drawScore(gameContext: any, gameInfos: Game) {
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
}
