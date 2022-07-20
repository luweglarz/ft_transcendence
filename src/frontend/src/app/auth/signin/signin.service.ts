import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../jwt';

@Injectable({
  providedIn: 'root',
})
export class SigninService {
  constructor(private jwt: JwtService, private router: Router) {}

  signInSuccess(token: string) {
    this.jwt.setToken(token);
    this.router.navigate(['/'], {
      replaceUrl: true,
    });
    this.jwt.logPayload();
  }

  signInFailure(err: any, form: any) {
    console.log(err);
    console.table(form);
  }
}
