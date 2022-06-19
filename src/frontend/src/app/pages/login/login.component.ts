import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
      'grant_type=client_credentials&client_id=' + environment.apiUid + '&' + 'client_secret=' + environment.apiSecret;
    //POST
    this.http
      .post<any>('https://api.intra.42.fr/oauth/token', body, { headers }).subscribe({
        next: data => {
          this.access_token = data.access_token;
          console.log('Recuperation de ' + data.access_token);
        },
        error: error => {
          console.log('Error');
        }
      });
  }

}
