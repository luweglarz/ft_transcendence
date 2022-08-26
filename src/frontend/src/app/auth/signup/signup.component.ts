import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { OAuthUserDto } from '../oauth/dto';
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
  oAuthUser?: OAuthUserDto;

  registerForm?: UntypedFormGroup;

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
  });

  oauthForm = this.formBuilder.group({
    username: new UntypedFormControl('', {
      validators: [Validators.required, Validators.maxLength(42)],
      asyncValidators: this.validators.isAvailable('username'),
      updateOn: 'change',
    }),
  });

  get username() {
    return this.registerForm?.get('username') as UntypedFormControl;
  }
  get password() {
    return this.registerForm?.get('password') as UntypedFormControl;
  }
  get email() {
    return this.registerForm?.get('email') as UntypedFormControl;
  }
  get twoFactors() {
    return this.registerForm?.get('twoFactors') as UntypedFormControl;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
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
      signUpStatus$.subscribe((response) => {
        this.signin.signInSuccess(
          response.tokens.access,
          response.tokens.refresh,
        );
        this.avatar.backendUpload();
      });
    }
  }
}
