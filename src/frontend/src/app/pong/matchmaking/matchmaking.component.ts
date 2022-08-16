import { Component } from '@angular/core';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { MatchmakingService } from './matchmaking.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent {
  constructor(
    public matchmakingService: MatchmakingService,
    public collapseService: CollapseService,
  ) {}

  buttonRequestJoinNormalMatchMaking() {
    this.matchmakingService.requestJoinNormalMatchMaking();
  }

  buttonRequestJoinCustomGamemodeMatchamking() {
    this.matchmakingService.requestJoinCustomGamemodeMatchamking();
  }

  buttonRequestLeaveMatchMaking() {
    this.matchmakingService.requestLeaveMatchMaking();
  }
}
