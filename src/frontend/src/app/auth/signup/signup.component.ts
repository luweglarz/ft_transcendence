import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { OAuthUser } from '../interface';
import { JwtService } from '../jwt';
import { SigninService } from '../signin/signin.service';
import { SignoutService } from '../signout/signout.service';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpType?: 'local' | 'oauth';
  image_url = '/assets/images/default-avatar.png';
  // Oauth specific
  token?: string;
  oAuthUser?: OAuthUser;

  registerForm?: FormGroup;

  localForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
    twoFactors: [false, Validators.required],
  });

  oauthForm = this.formBuilder.group({
    username: ['', Validators.required],
    twoFactors: [false, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: SignupService,
    private signin: SigninService,
    private avatar: AvatarService,
    private signOut: SignoutService,
    private jwt: JwtService,
  ) {}

  ngOnInit(): void {
    if (this.jwt.isValid()) {
      this.signOut.signOut();
      window.location.reload(); // to clear the avatar
    }
    this.route.queryParams.subscribe((params) => {
      if (params['type'] == 'oauth') {
        this.signUpType = 'oauth';
        this.registerForm = this.oauthForm;
        this.token = <string>params['jwt'];
        this.oAuthUser = this.service.getOAuthUserData(this.token);
        this.registerForm.patchValue({ username: this.oAuthUser.login });
        this.image_url = this.oAuthUser.image_url;
      } else if (params['type'] == 'local') {
        this.signUpType = 'local';
        this.registerForm = this.localForm;
      }
    });
  }

  get twoFactors() {
    return this.registerForm?.value.twoFactors;
  }

  signUp() {
    if (this.signUpType) {
      const signUpStatus$ = this.service.postSignUpData(
        this.signUpType,
        this.registerForm?.value,
        this.token,
      );
      signUpStatus$.subscribe((response: any) => {
        this.signin.signInSuccess(response['jwt']);
        this.avatar.backendUpload();
      });
    }
  }
}
