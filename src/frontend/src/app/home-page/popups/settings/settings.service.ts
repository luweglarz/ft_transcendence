import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { environment } from 'src/environments/environment';
import { UsernameUpdateDto } from './dto/username-update.dto';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient, private jwt: JwtService) {}

  updateUsername(username: string) {
    if (username) {
      const dto: UsernameUpdateDto = { username: username };
      this.http
        .post(`${environment.backend}/me/username/update`, dto)
        .subscribe(() => {
          this.jwt.refreshTokens().subscribe(() => {
            location.reload(); // especially for the sockets
          });
        });
    }
  }
}
