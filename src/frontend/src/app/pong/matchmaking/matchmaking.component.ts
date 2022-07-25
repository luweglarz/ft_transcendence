import { Component } from '@angular/core';
import { MatchmakingService } from './matchmaking.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent {
  constructor(private matchmakingService: MatchmakingService) {}

  buttonRequestJoinNormalMatchMaking() {
    this.matchmakingService.requestJoinNormalMatchMaking();
  }

  buttonRequestLeaveMatchMaking() {
    this.matchmakingService.requestLeaveMatchMaking();
  }
}
