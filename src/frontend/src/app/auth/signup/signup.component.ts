import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JwtService } from '../jwt';
import { OAuthService } from '../oauth';

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpType: 'local' | 'oauth' = 'local';
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
  ) {}

  ngOnInit(): void {
    this.jwt.testToken();
    this.route.queryParams.subscribe((params) => {
      if (params['code']) {
        this.signUpType = 'oauth';
      }
    });
    console.log(`signUpType: ${this.signUpType}`);
  }

  get twoFactors() {
    return this.registerForm.value.twoFactors;
  }

  signUp() {
    console.log(this.registerForm.value);
    this.http
      .post('http://localhost:3000/auth/local/signup', this.registerForm.value)
      .subscribe((response) => console.log(response));
  }

  oAuthSignUp() {
    this.oauth.authorize('signup');
  }
}
