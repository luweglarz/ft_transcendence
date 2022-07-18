import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  localRegister = false;
  oauthRegister = false;
  //Data to retrieved
  registerForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
    twoFactors: [false, Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    const jwt = localStorage.getItem('jwt');
    if (jwt) console.log(`My jwt: ${jwt}`);
  }

  get twoFactors() {
    return this.registerForm.value.twoFactors;
  }

  register() {
    console.log(this.registerForm.value);
    this.http
      .post('http://localhost:3000/auth/local/signup', this.registerForm.value)
      .subscribe((response) => console.log(response));
  }
}
