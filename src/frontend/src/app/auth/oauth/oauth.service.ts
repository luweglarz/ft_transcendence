import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../jwt';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  readonly authorize_url = 'https://api.intra.42.fr/oauth/authorize';
  readonly client_id =
    '86fb252b97a66621fd8e06b39794ec809a80cef7383535c464d0310c4ca7418a';
  readonly redirect_uri = encodeURI(
    'http://localhost:4200/auth/oauth42/callback',
  );
  readonly backend_temp_token_url =
    'http://localhost:3000/auth/oauth42/signup-temp-token';
  readonly backend_signin_url = 'http://localhost:3000/auth/oauth42/signin';

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwt: JwtService,
  ) {}

  authorize(state: 'signin' | 'signup') {
    window.location.href = `${this.authorize_url}?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&response_type=code&state=${state}`;
  }

  getSignupTempToken(code: string) {
    this.http
      .get<{ jwt: string }>(`${this.backend_temp_token_url}?code=${code}`)
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

  getSignInToken(code: string) {
    this.http
      .get<{ jwt: string }>(`${this.backend_signin_url}?code=${code}`)
      .subscribe({
        next: (response) => {
          this.jwt.setToken(response.jwt);
          this.router.navigate(['/'], {
            replaceUrl: true,
          });
        },
        error: (err) => console.error(err),
      });
  }
}
