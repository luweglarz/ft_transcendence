import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OAuthService } from '../oauth';
import { SignoutService } from '../signout/signout.service';
import { SigninService } from './signin.service';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  signinError?: string;
  private _signinErrorSubscription?: Subscription;

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
    // error state is used by JwtService if refresh fails
    if (window.history.state['error'])
      this.signinError = window.history.state['error'];
    // otherwise errors are emitted within SigninService
  }

  ngOnInit(): void {
    this.signOut.signOut();
    this._signinErrorSubscription = this.service.signinError$.subscribe(
      (err) => (this.signinError = err),
    );
  }
  ngOnDestroy(): void {
    this.service.signinErrorSubject.next('');
    this._signinErrorSubscription?.unsubscribe();
  }

  localSignIn() {
    this.service.signIn({ type: 'local', form: this.signInForm.getRawValue() });
  }

  oAuthSignIn() {
    this.oauth.authorize('signin');
  }
}
