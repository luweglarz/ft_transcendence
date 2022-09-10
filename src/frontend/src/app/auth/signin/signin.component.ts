import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OAuthService } from '../oauth';
import { SignoutService } from '../signout/signout.service';
import { SigninService } from './signin.service';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent implements OnInit {
  state = { failure: false, reason: '' };

  signInForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private oauth: OAuthService,
    private service: SigninService,
    private signOut: SignoutService,
  ) {
    const error = window.history.state['error'];
    if (error) {
      this.state.failure = true;
      this.state.reason = error;
    }
  }

  ngOnInit(): void {
    this.signOut.signOut();
  }

  localSignIn() {
    this.service.signIn(
      { type: 'local', form: this.signInForm.getRawValue() },
      this.state,
    );
  }

  oAuthSignIn() {
    this.oauth.authorize('signin');
  }
}
