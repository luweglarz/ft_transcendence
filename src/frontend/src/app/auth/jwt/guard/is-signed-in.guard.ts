import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtService } from '../jwt.service';

@Injectable({
  providedIn: 'root',
})
export class IsSignedInGuard implements CanActivate {
  constructor(private jwt: JwtService, private _router: Router) {}

  canActivate() {
    if (this.jwt.username) return true;
    else {
      this._router.navigate(['/auth/signin']);
      return false;
    }
  }
}
