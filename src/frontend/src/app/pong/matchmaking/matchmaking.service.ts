import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { JwtService } from 'src/app/auth/jwt';
import { InviteService } from 'src/app/home-page/services/invite.service';
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
    public socket: GameSocket,
    private gameService: GameService,
    public notificationService: NotificationService,
    private jwtService: JwtService,
    inviteService: InviteService,
  ) {
    this._stopWatch = new StopWatch();
    this.socket.once('error', (msg: string) => {
      console.log(msg);
    });
    this.socket.onMatchFound(
      this.notificationService,
      this.gameService,
      this,
      this._stopWatch,
    );
    this.socket.oninvitationAccepted(inviteService);
  }

  private _stopWatch: StopWatch;
  public game!: GameMode;

  get stopWatch(): StopWatch {
    return this._stopWatch;
  }

  requestJoinNormalMatchmaking() {
    this.jwtService
      .getToken$()
      .pipe(tap((token) => (this.socket.ioSocket.auth = { token: token })))
      .subscribe(() => {
        this.socket.connect();
        this.socket.onMatchFound(
          this.notificationService,
          this.gameService,
          this,
          this._stopWatch,
        );
        this.socket.emit('joinMatchmaking', 'normal');
        this.socket.onWaitingForAMatch(this.stopWatch);
        this.socket.onMatchmakingLeft();
      });
  }

  requestJoinRankedMatchmaking() {
    this.jwtService
      .getToken$()
      .pipe(tap((token) => (this.socket.ioSocket.auth = { token: token })))
      .subscribe(() => {
        this.socket.connect();
        this.socket.onMatchFound(
          this.notificationService,
          this.gameService,
          this,
          this._stopWatch,
        );
        this.socket.emit('joinMatchmaking', 'ranked');
        this.socket.onWaitingForAMatch(this.stopWatch);
        this.socket.onMatchmakingLeft();
      });
  }

  requestJoinCustomMatchmaking() {
    this.jwtService
      .getToken$()
      .pipe(tap((token) => (this.socket.ioSocket.auth = { token: token })))
      .subscribe(() => {
        this.socket.connect();
        this.socket.onMatchFound(
          this.notificationService,
          this.gameService,
          this,
          this._stopWatch,
        );
        this.socket.emit('joinMatchmaking', 'custom');
        this.socket.onWaitingForAMatch(this.stopWatch);
        this.socket.onMatchmakingLeft();
      });
  }

  requestLeaveMatchmaking() {
    this.jwtService
      .getToken$()
      .pipe(tap((token) => (this.socket.ioSocket.auth = { token: token })))
      .subscribe(() => {
        this._stopWatch.clearTimer();
        this.socket.emit('leaveMatchmaking');
      });
  }
}
