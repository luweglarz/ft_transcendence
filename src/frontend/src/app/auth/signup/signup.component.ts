import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../jwt';
import { OAuthService } from '../oauth';

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpType: 'local' | 'oauth' = 'local';
  // oauthCode?: string;
  token?: string;
  //Data to retrieved
  registerForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
    twoFactors: [false, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private jwt: JwtService,
    private oauth: OAuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.jwt.testToken();
    this.route.queryParams.subscribe((params) => {
      if (params['type'] == 'oauth') {
        this.signUpType = 'oauth';
        // this.oauthCode = params['code'];
        this.token = params['jwt'];
        // this.oauthCode = params['code'];
      }
    });
    console.log(`signUpType: ${this.signUpType}`);
  }

  get twoFactors() {
    return this.registerForm.value.twoFactors;
  }

  signUp() {
    console.log(this.registerForm.value);
    if (this.signUpType == 'local') {
      this.http
        .post(
          'http://localhost:3000/auth/local/signup',
          this.registerForm.value,
        )
        .subscribe((response) => console.log(response));
    } else {
      this.http
        .post(`http://localhost:3000/auth/oauth42/signup`, {
          ...this.registerForm.value,
          jwt: this.token,
        })
        .subscribe((response: any) => {
          this.jwt.setToken(response['jwt']);
          this.router.navigate(['/'], {
            replaceUrl: true,
          });
        });
    }
  }

  oAuthSignUp() {
    this.oauth.authorize('signup');
  }
}
