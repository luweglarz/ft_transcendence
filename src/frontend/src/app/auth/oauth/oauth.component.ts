import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OAuthService } from './oauth.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css'],
})
export class OauthComponent implements OnInit {
  constructor(private route: ActivatedRoute, private service: OAuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['code']) {
        if (params['state'] == 'signup')
          this.service.getSignupTempToken(params['code']);
        else if (params['state'] == 'signin')
          this.service.getSignInToken(params['code']);
      } else {
        console.warn('"code" or "state" query param is missing.');
      }
    });
  }
}
