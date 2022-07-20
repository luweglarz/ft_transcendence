import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { OAuthJwtPayload } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly local_signup_url = `${environment.backend}/auth/local/signup`;
  private readonly oauth_signup_url = `${environment.backend}/auth/oauth42/signup`;
  private readonly oauth_temp_token_url = `${environment.backend}/auth/oauth42/signup-temp-token`;

  constructor(private http: HttpClient, private router: Router) {}

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

  getTempToken(code: string) {
    this.http
      .get<{ jwt: string }>(`${this.oauth_temp_token_url}?code=${code}`)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/auth/signup'], {
            queryParams: { type: 'oauth', jwt: response.jwt },
            replaceUrl: true, // prevent going back to the callback page
          });
        },
        error: (err) => console.error(err),
      });
  }
}
