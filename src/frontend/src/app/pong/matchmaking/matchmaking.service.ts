import { Injectable } from '@angular/core';
import { NotificationService } from 'src/app/home-page/notification.service';
import { GameSocket } from '../class/game-socket';
import { StopWatch } from '../class/stop-watch';
import { GameComponent } from '../game/game.component';
import { GameService } from '../game/game.service';

@Injectable({
  providedIn: 'root',
})
export class MatchmakingService {
  constructor(
    private socket: GameSocket,
    private gameComponent: GameComponent,
    private gameService: GameService,
    public notificationService: NotificationService,
  ) {
    this._stopWatch = new StopWatch();
    this.socket.on('error', (msg: string) => {
      console.log(msg);
    });
    this.socket.on('waitingForAMatch', (msg: any) => {
      this._stopWatch.startTimer();
      console.log(msg);
    });
  }

  private _stopWatch: StopWatch;

  get stopWatch(): StopWatch {
    return this._stopWatch;
  }

  requestJoinNormalMatchMaking() {
    this.socket.connect();
    this.socket.emit('joinNormalMatchmaking', 'normal');
    this.socket.onMatchFound(
      this.notificationService,
      this.gameComponent,
      this.gameService,
      this._stopWatch,
    );
    this.socket.onMatchmakingLeft();
  }

  requestLeaveMatchMaking() {
    this._stopWatch.clearTimer();
    this.socket.emit('leaveMatchmaking');
  }
}
