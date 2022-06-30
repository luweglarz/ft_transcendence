import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { MatchmakingService } from '../matchmaking/matchmaking.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private matchmakingService: MatchmakingService,
    private socket: Socket,
    private router: Router,
  ) {
    //Todo
  }

  requestLeaveNormalGame() {
    this.matchmakingService.isInGame = false;
    this.socket.emit('leaveNormalGame');
  }

  movePaddle(event: KeyboardEvent) {
    this.socket.emit('move', event.key);
  }
}
