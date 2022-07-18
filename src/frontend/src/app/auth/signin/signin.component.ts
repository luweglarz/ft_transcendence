import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JwtService } from '../jwt';
//import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent implements OnInit {
  // access_token = 'access_token';

  signInForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private jwt: JwtService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
  ) {}
  // @Inject(DOCUMENT) private document: Document,
  // private http: HttpClient,
  // public router: Router,

  ngOnInit(): void {
    this.jwt.testToken();
  }

  localSignIn() {
    console.log(this.signInForm.value);
    this.http
      .post('http://localhost:3000/auth/local/signin', this.signInForm.value)
      .subscribe((response) => console.log(response));
  }

  oAuthSignIn() {
    window.location.href =
      'https://api.intra.42.fr/oauth/authorize?client_id=86fb252b97a66621fd8e06b39794ec809a80cef7383535c464d0310c4ca7418a&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth%2Foauth42%2Fcallback&response_type=code';
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
