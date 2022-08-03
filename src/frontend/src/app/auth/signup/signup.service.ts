import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly local_signup_url = `${environment.backend}/auth/local/signup`;
  private readonly oauth_signup_url = `${environment.backend}/auth/oauth42/signup`;

  constructor(private http: HttpClient) {}

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
