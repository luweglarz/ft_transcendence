import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { assets } from 'src/assets/assets';
import { environment } from 'src/environments/environment';
import { Avatar } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class AvatarUploadService {
  readonly default_src = assets.defaultAvatar;
  readonly uploaded: EventEmitter<string>;
  private avatar: Avatar = {
    src: this.default_src,
    file: undefined,
  };

  constructor(
    private readonly http: HttpClient,
    private readonly events: EventsService,
  ) {
    this.uploaded = this.events.avatar.upload;
  }

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
    const src = this.src;
    if (this.avatar.file) {
      const formData = new FormData();
      formData.append('avatar', this.avatar.file);
      this.http
        .post(`${environment.backend}/me/avatar`, formData)
        .subscribe(() => this.uploaded.next(src));
    } else {
      this.http
        .post(`${environment.backend}/me/avatar-clear`, {})
        .subscribe(() => this.uploaded.next(src));
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
