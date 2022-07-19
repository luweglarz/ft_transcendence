import { Injectable } from '@angular/core';

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

  authorize(state: 'signin' | 'signup') {
    window.location.href = `${this.authorize_url}?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&response_type=code&state=${state}`;
  }
}
