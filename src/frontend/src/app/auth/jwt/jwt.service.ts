import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private _token: string | null = null;

  getToken() {
    if (!this._token) this._token = localStorage.getItem('jwt');
    return this._token;
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
    this._token = token;
  }

  clearToken() {
    localStorage.removeItem('jwt');
    this._token = null;
  }
}
