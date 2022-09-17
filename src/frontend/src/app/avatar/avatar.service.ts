import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtService } from '../auth/jwt';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { assets } from 'src/assets/assets';
import { EventsService } from '../services/events.service';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  readonly default_src = assets.defaultAvatar;
  readonly me = {
    // The avatar of the logged-in user is likely to change on sign-in/sign-out
    src: new BehaviorSubject<string>(this.default_src),
  };

  constructor(
    private http: HttpClient,
    private jwt: JwtService,
    private readonly events: EventsService,
  ) {
    this._refreshSrc();
    this.events.auth.signin.subscribe(() => this._refreshSrc());
    this.events.auth.signout.subscribe(() => {
      this.me.src.next(this.default_src);
    });
    this.events.avatar.upload.subscribe((src) => {
      // console.debug(`Avatar refreshed with recently uploaded src.`);
      this.me.src.next(src);
    });
  }

  getSrc(username?: string) {
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

  private _refreshSrc() {
    if (this.jwt.username && this.me.src.value == this.default_src)
      this.getSrc(this.jwt.username).subscribe((src) => {
        // on signup the avatar upload and signin events can overlap
        // and on signin the server takes time to process the avatar
        if (this.me.src.value == this.default_src) {
          // console.debug(`Avatar refreshed with: ${src}`);
          this.me.src.next(src);
        }
      });
  }
}
