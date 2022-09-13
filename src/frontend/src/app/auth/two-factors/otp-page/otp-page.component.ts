import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticatorSigninDto, SignInSuccessDto } from '../../signin/dto';
import { SigninService } from '../../signin/signin.service';
import { OtpCode } from '../dto';

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp-page.component.html',
  styleUrls: ['./otp-page.component.css'],
})
export class OtpPageComponent implements OnInit {
  partialSigninToken?: string;
  constructor(private http: HttpClient, private signinService: SigninService) {}

  ngOnInit(): void {
    this.partialSigninToken = window.history.state['partialSigninToken'];
    if (!this.partialSigninToken)
      this.signinService.signInFailure('2FA interrupted');
  }

  signin(otp: OtpCode) {
    if (this.partialSigninToken) {
      const authenticatorSigninDto: AuthenticatorSigninDto = {
        partialToken: this.partialSigninToken,
        otp: otp.code,
      };
      this.http
        .post<SignInSuccessDto>(
          `${environment.backend}/auth/authenticator/signin`,
          authenticatorSigninDto,
        )
        .subscribe({
          next: (response) =>
            this.signinService.signInSuccess(
              response.tokens.access,
              response.tokens.refresh,
            ),
          error: (err: HttpErrorResponse) => {
            this.signinService.signInFailure(err);
          },
        });
    }
  }
}
