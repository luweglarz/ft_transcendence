import { Injectable } from '@angular/core';
import { JwtService } from '../jwt';

@Injectable({
  providedIn: 'root',
})
export class SignoutService {
  constructor(private jwt: JwtService) {}

  signOut() {
    this.jwt.clearToken();
  }
}
