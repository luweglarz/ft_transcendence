import { Component } from '@angular/core';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
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
  ) {}

  buttonRequestJoinNormalMatchMaking() {
    this.matchmakingService.requestJoinNormalMatchMaking();
    this.normalQueue = true;
    this.customQueue = false;
    this.rankedQueue = false;
  }

  buttonRequestJoinCustomGamemodeMatchamking() {
    this.matchmakingService.requestJoinCustomGamemodeMatchamking();
    this.normalQueue = false;
    this.customQueue = true;
    this.rankedQueue = false;
  }

  buttonRequestJoinRankedGamemodeMatchamking() {
    this.normalQueue = false;
    this.customQueue = false;
    this.rankedQueue = true;
  }

  buttonRequestLeaveMatchMaking() {
    this.matchmakingService.requestLeaveMatchMaking();
    this.normalQueue = false;
    this.customQueue = false;
    this.rankedQueue = false;
  }
}
