import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Avatar } from './interface';
import { JwtService } from '../auth/jwt';

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

  fetch() {
    if (this.jwt.isValid())
      this.http
        .get(`${environment.backend}/auth/avatar/download`, {
          responseType: 'blob',
        })
        .subscribe({
          next: (blob) => {
            if (blob.size) {
              this.update({ file: blob });
              console.log(blob);
            }
          },
          error: (err) => console.log(err),
        });
  }

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
      this.http
        .post(`${environment.backend}/auth/avatar/upload`, formData)
        .subscribe();
    }
  }
}
