import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { environment } from 'src/environments/environment';
import { JwtService } from '../jwt';

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
    private avatar: AvatarService,
  ) {}

  signIn(
    data: { type: 'oauth'; code: string } | { type: 'local'; form: any },
    state?: { failure: boolean; reason: string },
  ) {
    let url: string;
    let payload: any;

    if (data.type == 'local') {
      url = this.local_signin_url;
      payload = data.form;
    } else {
      url = `${this.oauth_signin_url}?code=${data.code}`;
      payload = undefined;
    }

    this.http.post<{ jwt: string }>(url, payload).subscribe({
      next: (response) => this.signInSuccess(response.jwt),
      error: (err: HttpErrorResponse) =>
        this.signInFailure(err, payload, state),
    });
  }

  signInSuccess(token: string) {
    this.jwt.setToken(token);
    this.avatar.fetch();
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
