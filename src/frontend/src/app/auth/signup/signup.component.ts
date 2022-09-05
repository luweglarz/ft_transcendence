import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OAuthUserDto } from '../oauth/dto';
import { JwtService } from '../jwt';
import { OAuthService } from '../oauth';
import { SigninService } from '../signin/signin.service';
import { SignoutService } from '../signout/signout.service';
import { SignupService } from './signup.service';
import { ValidatorBuilderService } from './validators/validator-builder.service';
import { AvatarUploadService } from 'src/app/avatar/avatar-upload/avatar-upload.service';
import { assets } from 'src/assets/assets';

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpType?: 'local' | 'oauth';
  image_url = assets.defaultAvatar;
  // Oauth specific
  token?: string;
  oAuthUser?: OAuthUserDto;
  private readonly _requirements = {
    username: [
      Validators.required,
      Validators.maxLength(42),
      Validators.pattern(/^[a-zA-Z0-9]*$/),
    ],
    password: [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(42),
    ],
  };

  registerForm?: UntypedFormGroup;

  localForm = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: this._requirements.username,
      asyncValidators: this.validators.isAvailable('username'),
      updateOn: 'change',
    }),
    password: ['', this._requirements.password],
  });

  oauthForm = this.formBuilder.group({
    username: new UntypedFormControl('', {
      validators: this._requirements.username,
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
  get twoFactors() {
    return this.registerForm?.get('twoFactors') as UntypedFormControl;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private service: SignupService,
    private signin: SigninService,
    private avatar: AvatarUploadService,
    private signOut: SignoutService,
    private jwt: JwtService,
    private validators: ValidatorBuilderService,
    private oauth: OAuthService,
  ) {}

  ngOnInit(): void {
    if (this.jwt.isValid()) {
      this.signOut.signOut();
      // window.location.reload(); // to clear the avatar
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
