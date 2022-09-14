import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { JwtService } from 'src/app/auth/jwt';
import { NotificationService } from 'src/app/home-page/services/notification.service';
import { GameSocket } from '../class/game-socket';
import { StopWatch } from '../class/stop-watch';
import { GameService } from '../game/game.service';
import { GameMode } from '../interface/game-mode';
import { InviteService } from './invite/invite.service';

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
  public queue?: 'normal' | 'custom' | 'ranked';

  get stopWatch(): StopWatch {
    return this._stopWatch;
  }

  requestJoinMatchmaking(type: typeof this.queue) {
    this.jwtService
      .getToken$()
      .pipe(tap((token) => (this.socket.ioSocket.auth = { token: token })))
      .subscribe(() => {
        this.socket.connect();
        this.socket.emit('joinMatchmaking', type);
        this.socket.onWaitingForAMatch(this.stopWatch);
        this.socket.onMatchFound(
          this.notificationService,
          this.gameService,
          this,
          this._stopWatch,
        );
        this.socket.emit('joinMatchmaking', 'normal');
        this.socket.onWaitingForAMatch(this.stopWatch);
        this.socket.onMatchmakingLeft();
        this.queue = type;
      });
  }

  requestLeaveMatchmaking() {
    this.jwtService
      .getToken$()
      .pipe(tap((token) => (this.socket.ioSocket.auth = { token: token })))
      .subscribe(() => {
        this._stopWatch.clearTimer();
        this.socket.emit('leaveMatchmaking');
        this.queue = undefined;
      });
  }
}
