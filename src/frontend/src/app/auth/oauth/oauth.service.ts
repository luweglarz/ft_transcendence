import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SigninService } from '../signin/signin.service';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  private readonly authorize_url = 'https://api.intra.42.fr/oauth/authorize';
  private readonly client_id =
    '86fb252b97a66621fd8e06b39794ec809a80cef7383535c464d0310c4ca7418a';
  private readonly frontend_url = 'http://localhost:4200';
  private readonly redirect_uri = encodeURI(
    `${this.frontend_url}/auth/oauth42/callback`,
  );

  private readonly backend_url = 'http://localhost:3000';
  private readonly backend_temp_token_url = `${this.backend_url}/auth/oauth42/signup-temp-token`;
  private readonly backend_signin_url = `${this.backend_url}/auth/oauth42/signin`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private signin: SigninService,
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
        next: (response) => this.signin.signInSuccess(response.jwt),
        error: (err) => console.error(err),
      });
  }
}
