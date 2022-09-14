import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { GameService } from '../game/game.service';

@Injectable({
  providedIn: 'root',
})
export class IsInGameGuard implements CanActivateChild {
  constructor(private gameService: GameService, private _router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.debug(state);
    // console.debug(route);
    if (state.url.startsWith('/game')) {
      if (this.gameService.isInGame.getValue() == false) {
        this._router.navigate([''], {
          queryParamsHandling: 'preserve',
        });
        return false;
        // return this._router.parseUrl('');
      }
    } else {
      if (this.gameService.isInGame.getValue() == true) {
        this._router.navigate(['/game'], {
          queryParamsHandling: 'preserve',
        });
        return false;
        // return this._router.parseUrl('/game');
      }
    }
    return true;
  }
}
