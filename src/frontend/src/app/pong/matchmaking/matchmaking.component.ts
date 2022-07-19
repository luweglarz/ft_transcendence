import { Component } from '@angular/core';
import { MatchmakingService } from './matchmaking.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent {

  //Original gamemode
  originalQueue : boolean = false;
  nbPlayersOriginal : number = 0;
  //timer
  msInQueue : number = 0;
  secInQueue : number = 0;
  running: boolean = false;
  timerRef = 0;

  constructor(private matchmakingService: MatchmakingService) {}

  startTimer() {
    //this.running = !this.running;
    this.originalQueue = !this.originalQueue;
    //if (this.running) {
    if (this,this.originalQueue) {
      const startTime = Date.now() - (this.msInQueue || 0);
      this.timerRef = setInterval(() => {
        this.msInQueue = Date.now() - startTime;
        if (this.msInQueue / 1000 >= this.secInQueue)
          this.secInQueue++;
      });
    }
    else {
      clearInterval(this.timerRef);
    }
  }

  clearTimer() {
    this.originalQueue = false;
    //this.running = false;
    this.msInQueue = 0;
    this.secInQueue = 0;
    clearInterval(this.timerRef);
  }

  buttonRequestJoinNormalMatchMaking() {
    this.matchmakingService.requestJoinNormalMatchMaking();
    //this.originalQueue = true;
    this.startTimer();
  }

  buttonRequestLeaveNormalMatchMaking() {
    this.matchmakingService.requestLeaveNormalMatchMaking();
    //this.originalQueue = false;
    this.clearTimer();
  }
}
