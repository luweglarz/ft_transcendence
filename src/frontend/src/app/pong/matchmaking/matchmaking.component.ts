import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { GameService } from '../game/game.service';
import { MatchmakingService } from './matchmaking.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  private _subscriptions = new Array<Subscription>();
  constructor(
    public matchmakingService: MatchmakingService,
    public collapseService: CollapseService,
    private gameService: GameService,
    private router: Router,
    private location: Location,
  ) {}

  get queue() {
    return this.matchmakingService.queue;
  }
  get stopWatch() {
    return this.matchmakingService.stopWatch;
  }

  ngOnInit() {
    this._subscriptions.push(
      this.gameService.isInGame.subscribe((isInGame) => {
        if (isInGame) this.router.navigate(['/game']);
      }),
    );
    // this.location.subscribe((popStateEvent) => {
    //   console.debug(popStateEvent);
    // });
  }

  buttonRequestJoinMatchmaking(matchmakingType: typeof this.queue) {
    this.matchmakingService.requestJoinMatchmaking(matchmakingType);
  }

  buttonRequestLeaveMatchmaking() {
    this.matchmakingService.requestLeaveMatchmaking();
  }

  ngOnDestroy() {
    for (const sub of this._subscriptions) sub.unsubscribe();
    // console.warn('destroy');
  }
}
