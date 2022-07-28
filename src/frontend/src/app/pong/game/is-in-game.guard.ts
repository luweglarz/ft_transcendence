import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class IsInGameGuard implements CanActivate {
  constructor(private router: Router, private gameService: GameService) {}

  canActivate(): boolean {
    if (this.gameService.isInGame === false) {
      //this.router.navigate(['/']);
      console.log('You are not in a game');
      return false;
    }
    return true;
  }
}
