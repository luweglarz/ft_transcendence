import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthUser } from '../interface';
import { OAuthService } from '../oauth';
import { SigninService } from '../signin/signin.service';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpType?: 'local' | 'oauth';
  token?: string;
  oAuthUser?: OAuthUser;
  image_url = '/assets/images/default-avatar.png';

  registerForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
    twoFactors: [false, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private oauth: OAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private service: SignupService,
    private signin: SigninService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['type'] == 'oauth') {
        this.signUpType = 'oauth';
        this.token = <string>params['jwt'];
        this.oAuthUser = this.service.getOAuthUserData(this.token);
        this.registerForm.patchValue({ username: this.oAuthUser.login });
        this.image_url = this.oAuthUser.image_url;
      } else if (params['type'] == 'local') {
        this.signUpType = 'local';
      }
    });
  }

  get twoFactors() {
    return this.registerForm.value.twoFactors;
  }

  signUp() {
    const signUpStatus$ = this.service.postSignUpData(
      this.signUpType!,
      this.registerForm.value,
      this.token,
    );
    signUpStatus$.subscribe((response: any) => {
      this.signin.signInSuccess(response['jwt']);
    });
  }

  oAuthSignUp() {
    this.oauth.authorize('signup');
  }

  localSignUp() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: 'local' },
    });
  }
}
