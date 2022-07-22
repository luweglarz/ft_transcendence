import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AvatarUploadService {
  image_file?: File;

  constructor(private http: HttpClient) {}

  backendUpload() {
    if (this.image_file) {
      const formData = new FormData();
      formData.append('avatar', this.image_file);
      this.http
        .post(`${environment.backend}/auth/upload/avatar`, formData)
        .subscribe();
    }
  }
}
