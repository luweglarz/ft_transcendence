import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  authorize() {
    window.location.href =
      'https://api.intra.42.fr/oauth/authorize?client_id=86fb252b97a66621fd8e06b39794ec809a80cef7383535c464d0310c4ca7418a&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth%2Foauth42%2Fcallback&response_type=code';
  }
}
