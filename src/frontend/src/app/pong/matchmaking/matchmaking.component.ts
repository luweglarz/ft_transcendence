import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { JwtService } from 'src/app/auth/jwt';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { GameService } from '../game/game.service';
import { InviteService } from './invite/invite.service';
import { MatchmakingService } from './matchmaking.service';
import { WaitService } from './wait/wait.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  private _navToGame?: Subscription;

  constructor(
    public matchmakingService: MatchmakingService,
    public collapseService: CollapseService,
    public inviteService: InviteService,
    public waitService: WaitService,
    private gameService: GameService,
    private router: Router,
    jwtService: JwtService,
  ) {
    jwtService
      .getToken$()
      .pipe(
        tap(
          (token) =>
            (this.matchmakingService.socket.ioSocket.auth = { token: token }),
        ),
      )
      .subscribe(() => {
        this.matchmakingService.socket.connect();
      });
  }

  get queue() {
    return this.matchmakingService.queue;
  }
  get stopWatch() {
    return this.matchmakingService.stopWatch;
  }

  ngOnInit() {
    this._navToGame = this.gameService.isInGame.subscribe((isInGame) => {
      if (isInGame) this.router.navigate(['/game']);
    });
  }
  ngOnDestroy() {
    this._navToGame?.unsubscribe();
  }

  buttonRequestJoinMatchmaking(matchmakingType: typeof this.queue) {
    this.matchmakingService.requestJoinMatchmaking(matchmakingType);
  }

  buttonRequestLeaveMatchmaking() {
    this.matchmakingService.requestLeaveMatchmaking();
  }
}
