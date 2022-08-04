import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Avatar } from './interface';
import { JwtService } from '../auth/jwt';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  readonly default_src = '/assets/images/default-avatar.png';
  private avatar: Avatar = {
    src: this.default_src,
    file: undefined,
  };

  constructor(private http: HttpClient, private jwt: JwtService) {
    this.fetch();
  }

  get src() {
    return this.avatar.src;
  }

  get file() {
    return this.avatar.file;
  }

  get me() {
    return this.user(this.jwt.username);
  }

  user(username?: string) {
    if (this.jwt.isValid()) {
      if (!username) username = this.jwt.username;
      return this.http
        .get(`${environment.backend}/users/${username}/has-avatar`)
        .pipe(
          map((hasAvatar) => {
            console.log(hasAvatar);
            return Boolean(hasAvatar)
              ? `${environment.backend}/users/${username}/avatar`
              : this.default_src;
          }),
          catchError((_) => of(this.default_src)),
        );
    } else return of(this.default_src);
  }

  /*
   * @brief GET avatar from backend, then update this.avatar (src and file)
   */
  fetch() {
    if (this.jwt.isValid())
      this.http
        .get(`${environment.backend}/users/${this.jwt?.username}/avatar`, {
          responseType: 'blob',
        })
        .subscribe({
          next: (blob) => {
            if (blob?.size) {
              this.update({ file: blob });
              console.log(blob);
            }
          },
          error: (err) => console.log(err),
        });
  }

  /*
   * @brief update this.avatar (src AND file) from partial avatar (src OR file)
   */
  update(data: Partial<Avatar>) {
    if (data.src) {
      this.avatar.src = data.src;
      if (!data.file) {
        this.http.get(data.src, { responseType: 'blob' }).subscribe((blob) => {
          this.avatar.file = blob;
        });
      }
    }
    if (data.file) {
      this.avatar.file = data.file;
      if (!data.src) {
        const reader = new FileReader();
        reader.addEventListener('load', (ev: ProgressEvent<FileReader>) => {
          // The load event is fired when a file has been read successfully.
          if (typeof ev.target?.result === 'string') {
            this.avatar.src = ev.target.result;
          }
        });
        reader.readAsDataURL(data.file);
      }
    }
  }

  backendUpload() {
    if (this.avatar.file) {
      const formData = new FormData();
      formData.append('avatar', this.avatar.file);
      this.http.post(`${environment.backend}/me/avatar`, formData).subscribe();
    }
  }

  /*
   * @brief reset this.avatar (src and file) to the default values
   */
  clear() {
    this.avatar.src = this.default_src;
    this.avatar.file = undefined;
  }
}
