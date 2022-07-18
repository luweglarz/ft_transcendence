import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JwtService } from '../jwt';

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
  localRegister = false;
  oauthRegister = false;
  //Data to retrieved
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
  ) {}

  ngOnInit(): void {
    this.jwt.testToken();
  }

  get twoFactors() {
    return this.registerForm.value.twoFactors;
  }

  signUp() {
    console.log(this.registerForm.value);
    this.http
      .post('http://localhost:3000/auth/local/signup', this.registerForm.value)
      .subscribe((response) => console.log(response));
  }
}
