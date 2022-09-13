import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { JwtService } from 'src/app/auth/jwt';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { InviteService } from 'src/app/home-page/services/invite.service';
import { EventsService } from 'src/app/services/events.service';
import { MatchmakingService } from './matchmaking.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent {
  normalQueue = false;
  customQueue = false;
  rankedQueue = false;

  constructor(
    public matchmakingService: MatchmakingService,
    public collapseService: CollapseService,
    private eventsService: EventsService,
    private inviteService: InviteService,
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
    console.log('constructor de matchamaking compo');
    this.matchmakingService.socket.on(
      'invitationAccepted',
      (friendUsername: string) => {
        this.inviteService.openInvite(friendUsername);
      },
    );
    this.eventsService.auth.signout.subscribe(() => {
      this.matchmakingService.requestLeaveMatchmaking();
      this.matchmakingService.socket.disconnect();
    });
  }

  buttonRequestJoinNormalMatchmaking() {
    this.matchmakingService.requestJoinNormalMatchmaking();
    this.normalQueue = true;
    this.customQueue = false;
    this.rankedQueue = false;
  }

  buttonRequestJoinRankedMatchmaking() {
    this.matchmakingService.requestJoinRankedMatchmaking();
    this.normalQueue = false;
    this.customQueue = false;
    this.rankedQueue = true;
  }

  buttonRequestJoinCustomMatchmaking() {
    this.matchmakingService.requestJoinCustomMatchmaking();
    this.normalQueue = false;
    this.customQueue = true;
    this.rankedQueue = false;
  }

  buttonRequestLeaveMatchmaking() {
    this.matchmakingService.requestLeaveMatchmaking();
    this.normalQueue = false;
    this.customQueue = false;
    this.rankedQueue = false;
  }
}
