import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { OAuthUser } from '../interface';
import { JwtService } from '../jwt';
import { OAuthService } from '../oauth';
import { SigninService } from '../signin/signin.service';
import { SignoutService } from '../signout/signout.service';
import { SignupService } from './signup.service';
import { ValidatorBuilderService } from './validators/validator-builder.service';

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
    username: this.formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(42)],
      asyncValidators: this.validators.isAvailable('username'),
      updateOn: 'change',
    }),
    password: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(42)],
    ],
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: this.validators.isAvailable('email'),
      updateOn: 'change',
    }),
    twoFactors: [false, Validators.required],
  });

  oauthForm = this.formBuilder.group({
    username: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(42)],
      asyncValidators: this.validators.isAvailable('username'),
      updateOn: 'change',
    }),
    twoFactors: [false, Validators.required],
  });

  get username() {
    return this.registerForm?.get('username') as FormControl;
  }
  get password() {
    return this.registerForm?.get('password') as FormControl;
  }
  get email() {
    return this.registerForm?.get('email') as FormControl;
  }
  get twoFactors() {
    return this.registerForm?.get('twoFactors') as FormControl;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: SignupService,
    private signin: SigninService,
    private avatar: AvatarService,
    private signOut: SignoutService,
    private jwt: JwtService,
    private validators: ValidatorBuilderService,
    private oauth: OAuthService,
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
        this.oAuthUser = this.oauth.getOAuthUserData(this.token);
        this.registerForm.patchValue({ username: this.oAuthUser.login });
        this.image_url = this.oAuthUser.image_url;
      } else if (params['type'] == 'local') {
        this.signUpType = 'local';
        this.registerForm = this.localForm;
      }
    });
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
