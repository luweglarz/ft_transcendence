import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from '../jwt';
import { OAuthService } from '../oauth';
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
    private jwt: JwtService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    //
  }

  localSignIn() {
    this.http
      .post<{ jwt: string }>(this.backend_signin_url, this.signInForm.value)
      .subscribe({
        next: (response) => {
          this.jwt.setToken(response.jwt);
          this.router.navigate(['/'], {
            replaceUrl: true,
          });
        },
        error: (err) => {
          console.table(this.signInForm.value);
          console.error(err);
        },
      });
  }

  oAuthSignIn() {
    this.oauth.authorize('signin');
  }

  // signin() {
  //Got a problem with git-secret, the API UI and KEY are not on this commit, need to fix this.
  /*const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body =
      'grant_type=client_credentials&client_id=' + environment.apiUid + '&' + 'client_secret=' + environment.apiSecret;
    this.http
      .post<any>('https://api.intra.42.fr/oauth/token', body, { headers }).subscribe({
        next: data => {
          this.access_token = data.access_token;
          console.log('Recuperation de ' + data.access_token);
        },
        error: error => {
          console.log('Error');
        }
      });*/
  // }
}
