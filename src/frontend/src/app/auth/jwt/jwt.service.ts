import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtData, JwtUser } from './dto';
import { JwtTokens } from './dto/tokens.dto';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  readonly refreshTokenUrl = `${environment.backend}/auth/jwt/refresh`;

  private readonly _accessTokenKey = 'accessToken';
  private readonly _refreshTokenKey = 'refreshToken';

  private _accessToken: string | null = null;
  private _data?: JwtData;

  constructor(private http: HttpClient) {
    this._accessToken = localStorage.getItem(this._accessTokenKey);
    if (this._accessToken) this._data = jwtDecode<JwtData>(this._accessToken);
  }

  //  =============================== Getters ================================  //

  get user(): JwtUser | undefined {
    const data = this._data;
    if (data) return { sub: data.sub, username: data.username };
    else return undefined;
  }
  get username() {
    return this._data?.username;
  }
  get id() {
    return this._data?.sub;
  }

  getToken() {
    // if (this._accessToken && !this.isValid()) this.refreshTokens();
    return this._accessToken;
  }

  get refreshToken() {
    return localStorage.getItem(this._refreshTokenKey);
  }

  //  =============================== Methods ================================  //

  refreshTokens() {
    this.http
      .get<JwtTokens>(this.refreshTokenUrl, {
        headers: {
          Authorization: `Bearer ${this.refreshToken}`,
        },
      })
      .subscribe((tokens) => this.storeTokens(tokens.access, tokens.refresh));
  }

  storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this._accessTokenKey, accessToken);
    localStorage.setItem(this._refreshTokenKey, refreshToken);
    this._accessToken = accessToken;
    this._data = jwtDecode<JwtData>(this._accessToken);
  }

  clearToken() {
    localStorage.removeItem(this._accessTokenKey);
    localStorage.removeItem(this._refreshTokenKey);
    this._accessToken = null;
    this._data = undefined;
  }

  logPayload() {
    if (this._data) {
      console.table(this._data);
    } else console.error('Could not load jwt payload');
  }

  isValid() {
    const exp = this._data?.exp;
    if (exp && exp * 1000 > Date.now()) return true;
    else return false;
  }

  expirationString() {
    const exp = this._data?.exp;
    if (exp) return new Date(exp * 1000).toString();
    else return '';
  }

  //  ================================ Tests =================================  //

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
