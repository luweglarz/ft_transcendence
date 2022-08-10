import { Injectable } from '@angular/core';
import { NotificationService } from 'src/app/home-page/services/notification.service';
import { GameSocket } from '../class/game-socket';
import { GameComponent } from '../game/game.component';
import { GameService } from '../game/game.service';

@Injectable({
  providedIn: 'root',
})
export class MatchmakingService {
  //Timer
  msInQueue = 0;
  secInQueue = 0;
  running = false;
  timer = 0;

  constructor(
    private socket: GameSocket,
    private gameComponent: GameComponent,
    private gameService: GameService,
    public notificationService: NotificationService,
  ) {
    this.socket.on('matchmakingLeft', (msg: any) => {
      console.log(msg);
    });
    this.socket.on('error', (msg: string) => {
      console.log(msg);
    });
  }

  //Timer
  //startTimer(queueBool: boolean) {
  startTimer() {
    //if (queueBool === true) {
    const startTime = Date.now() - (this.msInQueue || 0);
    this.timer = setInterval(() => {
      this.msInQueue = Date.now() - startTime;
      if (this.msInQueue / 1000 >= this.secInQueue) this.secInQueue++;
    });
    //} else clearInterval(this.timer);
  }

  clearTimer() {
    this.msInQueue = 0;
    this.secInQueue = 0;
    clearInterval(this.timer);
  }

  //Matchmaking
  requestJoinNormalMatchMaking() {
    this.socket.connect();
    this.socket.emit('joinNormalMatchmaking', 'normal');
    this.socket.once('waitingForAMatch', (msg: any) => {
      console.log(msg);
      this.startTimer();
    });
    this.socket.once(
      'matchFound',
      (msg: any, gameMapInfo: any, playersInfo: any) => {
        this.notificationService.gameFound();
        this.gameComponent.game.players[0].height = playersInfo.height;
        this.gameComponent.game.players[0].width = playersInfo.width;
        this.gameComponent.game.players[1].height = playersInfo.height;
        this.gameComponent.game.players[1].width = playersInfo.width;
        this.gameComponent.game.players[0].color = playersInfo.playerOneColor;
        this.gameComponent.game.players[1].color = playersInfo.playerTwoColor;
        this.gameComponent.game.players[0].username =
          playersInfo.playerOneUsername;
        this.gameComponent.game.players[1].username =
          playersInfo.playerTwoUsername;
        this.gameComponent.game.ball.color = gameMapInfo.ballColor;
        this.gameComponent.game.canvaHeight = gameMapInfo.canvaHeight;
        this.gameComponent.game.canvaWidth = gameMapInfo.canvaWidth;
        this.gameComponent.game.backgroundColor = gameMapInfo.backgroundColor;
        this.gameService.isInGame = true;
        this.gameComponent.game.ball.radius = gameMapInfo.ballRadius;
        console.log(msg);
      },
    );
  }

  requestLeaveMatchMaking() {
    this.socket.emit('leaveMatchmaking');
    this.clearTimer();
  }
}
