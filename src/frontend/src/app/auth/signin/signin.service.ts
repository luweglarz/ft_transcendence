import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EventsService } from 'src/app/services/events.service';
import { environment } from 'src/environments/environment';
import { JwtService } from '../jwt';
import { SignInPartialDto } from './dto';
import { LocalSigninDto } from './dto/local-signin.dto';
import { SignInSuccessDto } from './dto/signin-success.dto';
import { SignInData } from './interfaces/signin-data.interface';

@Injectable({
  providedIn: 'root',
})
export class SigninService {
  private readonly local_signin_url = `${environment.backend}/auth/local/signin`;
  private readonly oauth_signin_url = `${environment.backend}/auth/oauth42/signin`;
  private _signinError = new Subject<string>();
  siginError$ = this._signinError.asObservable();
  private signinEvent: EventEmitter<boolean>;

  constructor(
    private jwt: JwtService,
    private router: Router,
    private http: HttpClient,
    private readonly events: EventsService,
  ) {
    this.signinEvent = this.events.auth.signin;
  }

  signIn(data: SignInData) {
    let url: string;
    const payload: LocalSigninDto | undefined = data.form;

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
        error: (err: HttpErrorResponse) => {
          this.signInFailure(err);
          // if (payload) console.table(payload);
        },
      });
  }

  /*
   * @Brief store the access token redirect to home page
   */
  signInSuccess(accessToken: string, refreshToken: string) {
    this.jwt.storeTokens(accessToken, refreshToken);
    this.signinEvent.emit(true);
    this.router.navigate(['/'], {
      replaceUrl: true,
    });
    this.jwt.logPayload();
  }

  signInFailure(err: string | HttpErrorResponse) {
    // extract error
    let errMsg: string;
    if (typeof err == 'string') errMsg = err;
    else errMsg = err.error.message;

    // redirect to the signin page
    this.router
      .navigate(['/auth/signin'])
      .then(() => this._signinError.next(errMsg));
  }
}
