import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtService } from '../jwt';
import { OauthSigninDto, SignInPartialDto } from './dto';
import { LocalSigninDto } from './dto/local-signin.dto';
import { SignInSuccessDto } from './dto/signin-success.dto';
import { SignInData } from './interfaces/signin-data.interface';

@Injectable({
  providedIn: 'root',
})
export class SigninService {
  private readonly local_signin_url = `${environment.backend}/auth/local/signin`;
  private readonly oauth_signin_url = `${environment.backend}/auth/oauth42/signin`;

  constructor(
    private jwt: JwtService,
    private router: Router,
    private http: HttpClient,
  ) {}

  signIn(data: SignInData, state?: { failure: boolean; reason: string }) {
    let url: string;
    const payload: LocalSigninDto | OauthSigninDto = data.form;

    // Set url
    if (data.type == 'local') {
      url = this.local_signin_url;
    } else {
      url = `${this.oauth_signin_url}?code=${data.code}`;
    }

    // Post data
    this.http
      .post<SignInSuccessDto | SignInPartialDto>(url, payload)
      .subscribe({
        next: (response) => {
          if (response.status == 'partial')
            this.router.navigate(['/auth/2FA'], {
              state: { partialSigninToken: response.token },
            });
          else if (response.status == 'complete')
            this.signInSuccess(response.tokens.access, response.tokens.refresh);
        },
        error: (err: HttpErrorResponse) =>
          this.signInFailure(err, payload, state),
      });
  }

  /*
   * @Brief store the access token redirect to home page
   */
  signInSuccess(accessToken: string, refreshToken: string) {
    this.jwt.storeTokens(accessToken, refreshToken);
    this.router.navigate(['/'], {
      replaceUrl: true,
    });
    this.jwt.logPayload();
  }

  signInFailure(
    err: HttpErrorResponse,
    form: any,
    state?: { failure: boolean; reason: string },
  ) {
    console.error(err);
    console.table(form);
    if (state) {
      state.failure = true;
      if ('message' in err.error) state.reason = err.error.message;
    }
  }
}
