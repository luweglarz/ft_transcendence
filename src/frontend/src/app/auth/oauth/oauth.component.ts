import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../jwt';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css'],
})
export class OauthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private jwt: JwtService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['code']) {
        if (params['state'] == 'signup') {
          this.router.navigate(['/auth/signup'], {
            queryParams: { code: params['code'] },
            replaceUrl: true, // cannot go back to the callback page
          });
        } else if (params['state'] == 'signin') {
          this.http
            .get(
              `http://localhost:3000/auth/oauth42/redirect?code=${params['code']}`,
            )
            .subscribe((response: any) => {
              this.jwt.setToken(response['jwt']);
              this.router.navigate(['/'], {
                replaceUrl: true,
              });
            });
        }
      } else {
        if (this.jwt.getToken()) console.log(`My jwt: ${this.jwt.getToken()}`);
      }
    });
  }
}
