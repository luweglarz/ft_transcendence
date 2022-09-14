import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { EventsService } from 'src/app/services/events.service';
import { GameService } from '../game/game.service';
import { MatchmakingService } from './matchmaking.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent implements OnInit {
  constructor(
    public matchmakingService: MatchmakingService,
    public collapseService: CollapseService,
    private gameService: GameService,
    private router: Router,
    private eventsService: EventsService,
  ) {
    this.eventsService.auth.signout.subscribe(() => {
      this.matchmakingService.requestLeaveMatchmaking();
      this.matchmakingService.socket.disconnect();
    });
  }

  get queue() {
    return this.matchmakingService.queue;
  }
  get stopWatch() {
    return this.matchmakingService.stopWatch;
  }

  ngOnInit() {
    this.gameService.isInGame.subscribe((isInGame) => {
      if (isInGame) this.router.navigate(['/game']);
    });
  }

  buttonRequestJoinMatchmaking(matchmakingType: typeof this.queue) {
    this.matchmakingService.requestJoinMatchmaking(matchmakingType);
  }

  buttonRequestLeaveMatchmaking() {
    this.matchmakingService.requestLeaveMatchmaking();
  }
}
