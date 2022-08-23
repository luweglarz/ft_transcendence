import { Injectable } from '@angular/core';
import { GameService } from 'src/app/pong/game/game.service';
import { MatchmakingService } from 'src/app/pong/matchmaking/matchmaking.service';
import { JwtService } from '../jwt';

@Injectable({
  providedIn: 'root',
})
export class SignoutService {
  constructor(
    private jwt: JwtService,
    private matchmakingService: MatchmakingService,
    private gameService: GameService,
  ) {}

  signOut() {
    const username = this.jwt.username;
    this.jwt.clearToken();
    this.matchmakingService.requestLeaveMatchmaking();
    this.gameService.requestLeaveGame();
    if (username) console.log(`${username} successfully signed out`);
  }
}
