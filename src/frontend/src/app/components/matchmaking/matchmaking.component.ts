import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent implements OnInit {
  classicQueue = false;
  rankedQueue = false;
  funQueue = false;

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  joinClassicQueue() {
    this.classicQueue = true;
    this.rankedQueue = false;
    this.funQueue = false;
  }

  quitClassicQueue() {
    this.classicQueue = false;
  }

  joinRankedQueue() {
    this.rankedQueue = true;
    this.classicQueue = false;
    this.funQueue = false;
  }

  quitRankedQueue() {
    this.rankedQueue = false;
  }

  joinFunQueue() {
    this.funQueue = true;
    this.classicQueue = false;
    this.rankedQueue = false;
  }

  quitFunQueue() {
    this.funQueue = false;
  }
}
