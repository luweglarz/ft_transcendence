import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  access_token = 'access_token';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    public router: Router,
  ) {
    //
  }

  ngOnInit(): void {
    //
  }

  login() {
    //Headers
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    //Body
    const body =
      'grant_type=client_credentials&client_id=eeb0e0a43e664699fe90ad4eefdec48dc656e8b75737d363731f5221dd57f6dd&client_secret=***REMOVED***';
    //POST
    this.http
      .post<any>('https://api.intra.42.fr/oauth/token', body, { headers })
      .subscribe((data) => {
        console.log(data);
      });

    //Redirect to the 42 sign-in page
    //this.document.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=eeb0e0a43e664699fe90ad4eefdec48dc656e8b75737d363731f5221dd57f6dd&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F&response_type=code";
  }
}
