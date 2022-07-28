import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SigninService } from '../signin/signin.service';
import { SignupService } from '../signup/signup.service';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  private readonly authorize_url = 'https://api.intra.42.fr/oauth/authorize';
  private readonly get_client_id_url = `${environment.backend}/auth/oauth42/client_id`;
  private client_id = '';
  private readonly redirect_uri = encodeURI(
    `${environment.frontend}/auth/oauth42/callback`,
  );

  constructor(
    private http: HttpClient,
    private signup: SignupService,
    private signin: SigninService,
  ) {}

  /*
   * @brief redirect to 42's login page
   */
  authorize(state: 'signin' | 'signup') {
    this.http
      .get<{ client_id: string }>(this.get_client_id_url)
      .subscribe((response) => {
        this.client_id = response.client_id;
        window.location.href = `${this.authorize_url}?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&response_type=code&state=${state}`;
      });
  }

  /*
   * @brief redirect to the signin or signup page
   * according to the callback url state
   */
  oauthCallback(route: ActivatedRoute) {
    route.queryParams.subscribe((params) => {
      if (params['code']) {
        if (params['state'] == 'signup')
          this.signup.getTempToken(params['code']);
        else if (params['state'] == 'signin')
          this.signin.signIn({ type: 'oauth', code: params['code'] });
      } else {
        console.warn('"code" or "state" query param is missing.');
      }
    });
  }
}
