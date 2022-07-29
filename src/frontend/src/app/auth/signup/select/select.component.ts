import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from '../../oauth';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['../signup.component.css'],
})
export class SelectComponent implements OnInit {
  constructor(
    private oauth: OAuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  localSignUp() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: 'local' },
    });
  }

  oAuthSignUp() {
    this.oauth.authorize('signup');
  }
}
