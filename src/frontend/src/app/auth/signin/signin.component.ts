import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OAuthService } from '../oauth';
import { SigninService } from './signin.service';
//import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent implements OnInit {
  private readonly backend_signin_url =
    'http://localhost:3000/auth/local/signin';

  signInForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private oauth: OAuthService,
    private service: SigninService,
  ) {}

  ngOnInit(): void {
    //
  }

  localSignIn() {
    this.http
      .post<{ jwt: string }>(this.backend_signin_url, this.signInForm.value)
      .subscribe({
        next: (response) => this.service.signInSuccess(response.jwt),
        error: (err) => this.service.signInFailure(err, this.signInForm.value),
      });
  }

  oAuthSignIn() {
    this.oauth.authorize('signin');
  }
}
