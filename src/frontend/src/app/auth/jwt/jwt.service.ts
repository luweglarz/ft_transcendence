import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import {
  BehaviorSubject,
  catchError,
  filter,
  lastValueFrom,
  map,
  of,
  take,
  tap,
} from 'rxjs';
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
  private httpNoIntercept: HttpClient;

  private _accessToken$ = new BehaviorSubject<string | null>(null);
  private _ongoingRefresh = false;
  private _data?: JwtData;

  constructor(private http: HttpClient, httpBackend: HttpBackend) {
    this.httpNoIntercept = new HttpClient(httpBackend);
    this._accessToken$.next(localStorage.getItem(this._accessTokenKey));
    const token = this._accessToken$.getValue();
    if (token) {
      this._data = jwtDecode<JwtData>(token);
    }
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

  getToken$() {
    const token = this._accessToken$.getValue();

    if (this._ongoingRefresh) {
      return this._accessToken$.pipe(
        // TODO: fix possible issue when token refreshing fails (value === null)
        filter((value) => value !== null),
        take(1),
      );
    } else if (token && !this.isValid()) {
      this._ongoingRefresh = true;
      this._accessToken$.next(null);
      return this.refreshTokens().pipe(
        map((tokens) => {
          if (tokens) return tokens.access;
          else return null;
        }),
        tap(() => (this._ongoingRefresh = false)),
      );
    } else return of(token).pipe(take(1));
  }

  private get refreshToken() {
    return localStorage.getItem(this._refreshTokenKey);
  }

  //  =============================== Methods ================================  //

  private refreshTokens() {
    return this.httpNoIntercept
      .get<JwtTokens>(this.refreshTokenUrl, {
        headers: {
          Authorization: `Bearer ${this.refreshToken}`,
        },
      })
      .pipe(
        tap((tokens) => this.storeTokens(tokens.access, tokens.refresh)),
        catchError((err) => {
          console.error(`Could not refresh token (${err})`);
          this._accessToken$.next(null);
          return of(null);
        }),
      );
  }

  storeTokens(accessToken: string, refreshToken: string) {
    console.log('Storing tokens');
    localStorage.setItem(this._accessTokenKey, accessToken);
    localStorage.setItem(this._refreshTokenKey, refreshToken);
    this._accessToken$.next(accessToken);
    this._data = jwtDecode<JwtData>(accessToken);
  }

  clearToken() {
    localStorage.removeItem(this._accessTokenKey);
    localStorage.removeItem(this._refreshTokenKey);
    this._accessToken$.next(null);
    this._data = undefined;
  }

  logPayload() {
    if (this._data) {
      console.table(this._data);
    } else console.error('Could not load jwt payload');
  }

  /*
   * @brief return false if access token currently invalid or being refreshed
   */
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
    const token = await lastValueFrom(this.getToken$());
    if (token) {
      console.log(`My jwt: ${this._accessToken$.getValue()}`);
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
