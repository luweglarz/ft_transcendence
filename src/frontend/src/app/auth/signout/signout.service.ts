import { Injectable } from '@angular/core';
import { JwtService } from '../jwt';

@Injectable({
  providedIn: 'root',
})
export class SignoutService {
  constructor(private jwt: JwtService) {}

  signOut() {
    const username = this.jwt.getPayload()?.username;
    this.jwt.clearToken();
    if (username) console.log(`${username} successfully signed out`);
  }
}
