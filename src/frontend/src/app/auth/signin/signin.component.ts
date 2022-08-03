import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
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

  signInForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: UntypedFormBuilder,
    private oauth: OAuthService,
    private service: SigninService,
    private signOut: SignoutService,
  ) {}

  ngOnInit(): void {
    this.signOut.signOut();
  }

  localSignIn() {
    this.service.signIn(
      { type: 'local', form: this.signInForm.value },
      this.state,
    );
  }

  oAuthSignIn() {
    this.oauth.authorize('signin');
  }
}
