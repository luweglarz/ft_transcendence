import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignInData } from '../../signin/interfaces/signin-data.interface';
import { SigninService } from '../../signin/signin.service';
import { OtpCode } from '../dto';

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp-page.component.html',
  styleUrls: ['./otp-page.component.css'],
})
export class OtpPageComponent implements OnInit {
  signinData?: SignInData;
  constructor(private router: Router, private signinService: SigninService) {}

  ngOnInit(): void {
    this.signinData = window.history.state['signin'];
    if (!this.signinData) this.router.navigate(['/auth/signin']);
  }

  signin(otp: OtpCode) {
    if (this.signinData) {
      // console.log(this.signinData);
      // console.log(otp);
      this.signinData.form.otp = otp.code;
      this.signinService.signIn(this.signinData);
    }
  }
}
