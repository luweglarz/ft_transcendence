import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { OAuthJwtPayload, OAuthUser } from '../interface';
import { JwtService } from '../jwt';
import { OAuthService } from '../oauth';

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpType?: 'local' | 'oauth';
  token?: string;
  oauthData?: OAuthUser;
  image_url = '/assets/images/default-avatar.png';

  registerForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
    twoFactors: [false, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private jwt: JwtService,
    private oauth: OAuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['type'] == 'oauth') {
        this.signUpType = 'oauth';
        this.token = <string>params['jwt'];
        this.oauthData = jwtDecode<OAuthJwtPayload>(this.token).oAuthUser;
        console.table(this.oauthData);
        this.registerForm.patchValue({ username: this.oauthData.login });
        this.image_url = this.oauthData.image_url;
      } else if (params['type'] == 'local') {
        this.signUpType = 'local';
      }
    });
  }

  get twoFactors() {
    return this.registerForm.value.twoFactors;
  }

  signUp() {
    console.table(this.registerForm.value);
    let signUpStatus$: Observable<any>;
    if (this.signUpType == 'local') {
      signUpStatus$ = this.http.post(
        'http://localhost:3000/auth/local/signup',
        this.registerForm.value,
      );
    } else {
      signUpStatus$ = this.http.post(
        `http://localhost:3000/auth/oauth42/signup`,
        {
          ...this.registerForm.value,
          jwt: this.token,
        },
      );
    }
    signUpStatus$.subscribe((response: any) => {
      this.jwt.setToken(response['jwt']);
      this.router.navigate(['/'], {
        replaceUrl: true,
      });
    });
  }

  oAuthSignUp() {
    this.oauth.authorize('signup');
  }

  localSignUp() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: 'local' },
    });
  }
}
