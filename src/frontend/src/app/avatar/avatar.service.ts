import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtService } from '../auth/jwt';
import { catchError, map, of } from 'rxjs';
import { assets } from 'src/assets/assets';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  readonly default_src = assets.defaultAvatar;

  constructor(private http: HttpClient, private jwt: JwtService) {}

  get me() {
    return this.user(this.jwt.username);
  }

  user(username?: string) {
    if (username) {
      return this.http
        .get(`${environment.backend}/users/${username}/has-avatar`)
        .pipe(
          map((hasAvatar) => {
            return Boolean(hasAvatar)
              ? `${environment.backend}/users/${username}/avatar`
              : this.default_src;
          }),
          catchError(() => of(this.default_src)),
        );
    } else return of(this.default_src);
  }
}
