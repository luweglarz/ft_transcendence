import { Injectable } from '@angular/core';
import { NotificationService } from 'src/app/home-page/services/notification.service';
import { GameSocket } from '../class/game-socket';
import { StopWatch } from '../class/stop-watch';
import { GameService } from '../game/game.service';
import { GameMode } from '../interface/game-mode';

@Injectable({
  providedIn: 'root',
})
export class MatchmakingService {
  constructor(
    private socket: GameSocket,
    private gameService: GameService,
    public notificationService: NotificationService,
  ) {
    this._stopWatch = new StopWatch();
    this.socket.on('error', (msg: string) => {
      console.log(msg);
    });
  }

  private _stopWatch: StopWatch;
  public game!: GameMode;

  get stopWatch(): StopWatch {
    return this._stopWatch;
  }

  requestJoinNormalMatchmaking() {
    this.socket.connect();
    this.socket.emit('joinMatchmaking', 'normal');
    this.socket.onWaitingForAMatch(this.stopWatch);
    this.socket.onMatchFound(
      this.notificationService,
      this.gameService,
      this,
      this._stopWatch,
    );
    this.socket.onMatchmakingLeft();
  }

  requestJoinRankedMatchmaking() {
    this.socket.connect();
    this.socket.emit('joinMatchmaking', 'ranked');
    this.socket.onWaitingForAMatch(this.stopWatch);
    this.socket.onMatchFound(
      this.notificationService,
      this.gameService,
      this,
      this._stopWatch,
    );
    this.socket.onMatchmakingLeft();
  }

  requestJoinCustomMatchmaking() {
    this.socket.connect();
    this.socket.emit('joinMatchmaking', 'custom');
    this.socket.onWaitingForAMatch(this.stopWatch);
    this.socket.onMatchFound(
      this.notificationService,
      this.gameService,
      this,
      this._stopWatch,
    );
    this.socket.onMatchmakingLeft();
  }

  requestLeaveMatchmaking() {
    this._stopWatch.clearTimer();
    this.socket.emit('leaveMatchmaking');
  }
}
