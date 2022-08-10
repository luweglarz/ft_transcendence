import { Component } from '@angular/core';
import { CollapseService } from 'src/app/home-page/collapse.service';
import { MatchmakingService } from './matchmaking.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent {
  //Queues
  originalQueue = false;
  funQueue = false;
  rankedQueue = false;

  constructor(
    private matchmakingService: MatchmakingService,
    public collapseService: CollapseService,
  ) {}

  buttonRequestJoinNormalMatchMaking() {
    this.matchmakingService.requestJoinNormalMatchMaking();
    this.originalQueue = true;
  }

  buttonRequestJoinFunMatchMaking() {
    this.funQueue = true;
  }

  buttonRequestJoinRankedMatchMaking() {
    this.rankedQueue = true;
  }

  buttonRequestLeaveMatchMaking() {
    this.matchmakingService.requestLeaveMatchMaking();
    this.originalQueue = false;
    this.funQueue = false;
    this.rankedQueue = false;
  }
}
