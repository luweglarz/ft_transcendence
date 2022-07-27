import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SigninService } from '../signin/signin.service';
import { SignupService } from '../signup/signup.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css'],
})
export class OauthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private signup: SignupService,
    private signin: SigninService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['code']) {
        if (params['state'] == 'signup')
          this.signup.getTempToken(params['code']);
        else if (params['state'] == 'signin')
          this.signin.signIn({ type: 'oauth', code: params['code'] });
      } else {
        console.warn('"code" or "state" query param is missing.');
      }
    });
  }
}
