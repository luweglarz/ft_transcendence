import { Component, OnInit } from '@angular/core';
import { OAuthService } from './oauth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
})
export class OauthCallbackComponent implements OnInit {
  constructor(private service: OAuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.service.oauthCallback(this.route);
  }
}
