import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OAuthService } from '../oauth';
import { SigninService } from './signin.service';
//import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent implements OnInit {
  signInForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private oauth: OAuthService,
    private service: SigninService,
  ) {}

  ngOnInit(): void {
    //
  }

  localSignIn() {
    this.service.signIn({ type: 'local', form: this.signInForm.value });
  }

  oAuthSignIn() {
    this.oauth.authorize('signin');
  }
}
