import { Component, OnInit } from '@angular/core';
import { MatchmakingService } from './matchmaking.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent implements OnInit {
  constructor(private matchmakingService: MatchmakingService) {}

  ngOnInit(): void {
    // TODO
  }

  buttonRequestJoinNormalMatchMaking() {
    this.matchmakingService.requestJoinNormalMatchMaking();
  }

  buttonRequestLeaveNormalMatchMaking() {
    this.matchmakingService.requestLeaveNormalMatchMaking();
  }
}
