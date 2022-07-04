import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class IsInGameGuard implements CanActivate {
  constructor(private router: Router, private gameService: GameService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.gameService.isInGame === false) {
      this.router.navigate(['matchmaking']);
      console.log('You are not in a game');
    }
    return true;
  }
}
