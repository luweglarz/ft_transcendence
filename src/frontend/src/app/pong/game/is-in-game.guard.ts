import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatchmakingService } from '../matchmaking/matchmaking.service';

@Injectable({
  providedIn: 'root',
})
export class IsInGameGuard implements CanActivate {
  constructor(
    private router: Router,
    private matchmakingService: MatchmakingService,
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.matchmakingService.isInGame === false) {
      this.router.navigate(['matchmaking']);
      console.log('You are not in a game');
    }
    return true;
  }
}
