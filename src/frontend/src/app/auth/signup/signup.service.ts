import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { OAuthJwtPayload } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly backend_url = 'http://localhost:3000';
  private readonly local_signup_url = `${this.backend_url}/auth/local/signup`;
  private readonly oauth_signup_url = `${this.backend_url}/auth/oauth42/signup`;

  constructor(private http: HttpClient) {}

  getOAuthUserData(token: string) {
    return jwtDecode<OAuthJwtPayload>(token).oAuthUser;
  }

  postSignUpData(type: 'local' | 'oauth', payload: any, token?: string) {
    console.table(payload);
    if (type == 'local') {
      return this.http.post(this.local_signup_url, payload);
    } else {
      return this.http.post(this.oauth_signup_url, {
        ...payload,
        jwt: token,
      });
    }
  }
}
