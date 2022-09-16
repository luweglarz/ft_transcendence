import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsernameUpdateDto } from './dto/username-update.dto';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient) {}

  updateUsername(username: string) {
    if (username) {
      const dto: UsernameUpdateDto = { username: username };
      this.http
        .post(`${environment.backend}/me/username/update`, dto)
        .subscribe((resp) => {
          console.debug(resp);
        });
    }
  }
}
