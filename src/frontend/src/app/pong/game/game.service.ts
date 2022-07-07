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
    // },100);
  }

  clearCanvas(gameCanvas: ElementRef, gameContext: any) {
    gameContext.clearRect(
      0,
      0,
      gameCanvas.nativeElement.width,
      gameCanvas.nativeElement.height,
    );
  }

  drawGameBorders(gameCanvas: ElementRef, gameContext: any, gameInfos: Game) {
    gameContext.strokeStyle = gameInfos.borderColor;
    gameContext.lineWidth = 5;
    gameContext.strokeRect(
      Math.round((gameCanvas.nativeElement.width * 5) / 100 / 2),
      Math.round((gameCanvas.nativeElement.height * 5) / 100 / 2),
      gameInfos.borderWidth,
      gameInfos.borderHeight,
    );

    gameContext.moveTo(
      Math.round(gameInfos.canvaWidth / 2),
      Math.round((gameInfos.canvaHeight * 5) / 100 / 2),
    );
    gameContext.lineTo(
      Math.round(gameInfos.canvaWidth / 2),
      Math.round(gameInfos.borderHeight + gameContext.lineWidth * 2 + 1),
    );
    gameContext.strokeStyle = gameInfos.borderColor;
    gameContext.stroke();
  }

  drawPaddle(gameContext: any, player: Player) {
    gameContext.fillRect(player.x, player.y, player.width, player.height);
  }

  drawBall(gameContext: any, ball: Ball) {
    gameContext.beginPath();
    gameContext.fillStyle = 'black';
    gameContext.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    gameContext.fill();
    gameContext.stroke();
  }
}
