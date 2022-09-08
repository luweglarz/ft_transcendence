import { Component } from '@angular/core';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
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
  ) {
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
