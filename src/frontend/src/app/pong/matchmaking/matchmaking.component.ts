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
  nbPlayersOriginal = 0;
  //timer
  msInQueue = 0;
  secInQueue = 0;
  running = false;
  timer = 0;

  constructor(
    private matchmakingService: MatchmakingService,
    public collapseService: CollapseService,
  ) {}

  startTimer(queueBool: boolean) {
    if (queueBool === true) {
      const startTime = Date.now() - (this.msInQueue || 0);
      this.timer = setInterval(() => {
        this.msInQueue = Date.now() - startTime;
        if (this.msInQueue / 1000 >= this.secInQueue) this.secInQueue++;
      });
    } else clearInterval(this.timer);
  }

  clearTimer() {
    this.msInQueue = 0;
    this.secInQueue = 0;
    clearInterval(this.timer);
  }

  buttonRequestJoinNormalMatchMaking() {
    this.matchmakingService.requestJoinNormalMatchMaking();
    this.originalQueue = true;
    this.startTimer(this.originalQueue);
  }

  buttonRequestLeaveMatchMaking() {
    this.matchmakingService.requestLeaveMatchMaking();
    this.originalQueue = false;
    this.clearTimer();
  }
}
