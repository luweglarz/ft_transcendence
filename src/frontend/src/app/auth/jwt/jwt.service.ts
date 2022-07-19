import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

export interface JwtPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private _token: string | null = null;
  constructor(private http: HttpClient) {}

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

  getPayload() {
    const token = this.getToken();
    if (token) return jwtDecode<JwtPayload>(token);
    else return undefined;
  }

  isValid() {
    const payload = this.getPayload();
    if (payload && payload.exp * 1000 > Date.now()) return true;
    else return false;
  }

  expirationString() {
    const payload = this.getPayload();
    if (payload) return new Date(payload.exp * 1000).toString();
    else return '';
  }

  testToken() {
    if (this.getToken()) {
      console.log(`My jwt: ${this._token}`);
      this.http
        .get(`http://localhost:3000/auth/private`)
        .subscribe((response) => console.log(response));
    } else console.warn('Not signed in!');
  }
}