import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { assets } from 'src/assets/assets';
import { environment } from 'src/environments/environment';
import { Avatar } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class AvatarUploadService {
  readonly default_src = assets.defaultAvatar;
  readonly uploaded = new Subject<boolean>();
  private avatar: Avatar = {
    src: this.default_src,
    file: undefined,
  };

  constructor(private readonly http: HttpClient) {}

  get src() {
    return this.avatar.src;
  }
  get file() {
    return this.avatar.file;
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
      this.http
        .post(`${environment.backend}/me/avatar`, formData)
        // setTimeout: let time to the db to process the upload (especially for large image)
        .subscribe(() => setTimeout(() => this.uploaded.next(true), 1000));
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
