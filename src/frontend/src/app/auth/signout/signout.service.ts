import { Injectable } from '@angular/core';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { JwtService } from '../jwt';

@Injectable({
  providedIn: 'root',
})
export class SignoutService {
  constructor(private jwt: JwtService, private avatar: AvatarService) {}

  signOut() {
    const username = this.jwt.getPayload()?.username;
    this.jwt.clearToken();
    if (username) console.log(`${username} successfully signed out`);
  }
}
