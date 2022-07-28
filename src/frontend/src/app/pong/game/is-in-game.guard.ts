import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class IsInGameGuard implements CanActivate {
  constructor(private gameService: GameService) {}

  canActivate(): boolean {
    if (this.gameService.isInGame === false) {
      console.log('You are not in a game');
      return false;
    }
    return true;
  }
}
