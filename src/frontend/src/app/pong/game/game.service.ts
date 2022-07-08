import { ElementRef, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Ball } from '../class/ball';
import { Game } from '../class/game';
import { Player } from '../class/player';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private socket: Socket) {
    //Todo
  }

  public isInGame = false;

  requestLeaveNormalGame() {
    this.isInGame = false;
    this.socket.emit('leaveNormalGame');
  }

  movePaddle(event: KeyboardEvent) {
    this.socket.emit('move', event.key);
    // setTimeout( () => {
    // this.socket.emit('move', "stop");
    // },200);
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
        gameInfos.canvaWidth / 4,
      50,
    );
  }
}
