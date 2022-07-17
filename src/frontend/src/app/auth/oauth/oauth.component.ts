import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (params['code'])
        this.http
          .get(`http://localhost:3000/oauth/redirect?code=${params['code']}`)
          .subscribe((response: any) => {
            console.log(response);
            localStorage.setItem('jwt', response['jwt']);
            this.router.navigate(['/register']);
          });
      else {
        // this.router.navigate(['/not-found']);
        const jwt = localStorage.getItem('jwt');
        if (jwt) console.log(`My jwt: ${jwt}`);
      }
    });
  }
}
