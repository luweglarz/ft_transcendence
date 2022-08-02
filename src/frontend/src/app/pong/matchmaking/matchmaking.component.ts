import { Component } from '@angular/core';
import { CollapseService } from 'src/app/home-page/collapse.service';
import { MatchmakingService } from './matchmaking.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent {
  //Original gamemode
  originalQueue = false;

  constructor(
    public matchmakingService: MatchmakingService,
    public collapseService: CollapseService,
  ) {}



  buttonRequestJoinNormalMatchMaking() {
    this.matchmakingService.requestJoinNormalMatchMaking();
    this.originalQueue = true;
  }

  buttonRequestLeaveMatchMaking() {
    this.matchmakingService.requestLeaveMatchMaking();
    this.originalQueue = false;
  }
}
