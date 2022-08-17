import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';
  private _accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  get username() {
    return this.getPayload()?.username;
  }

  getToken() {
    if (!this._accessToken)
      this._accessToken = localStorage.getItem(this.accessTokenKey);
    return this._accessToken;
  }

  storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this._accessToken = accessToken;
  }

  clearToken() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this._accessToken = null;
  }

  getPayload() {
    const token = this.getToken();
    if (token) return jwtDecode<JwtPayload>(token);
    else return undefined;
  }

  logPayload() {
    const payload = this.getPayload();
    if (payload) {
      console.table(payload);
    } else console.error('Could not load jwt payload');
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

  async testToken() {
    let status = { message: 'Cannot establish private connection... 🛑' };
    if (this.getToken()) {
      console.log(`My jwt: ${this._accessToken}`);
      try {
        status = await lastValueFrom<{ message: string }>(
          this.http.get<{ message: string }>(
            `${environment.backend}/auth/private`,
          ),
        );
        console.log(status);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.warn('No token available');
    }
    return status;
  }
}
