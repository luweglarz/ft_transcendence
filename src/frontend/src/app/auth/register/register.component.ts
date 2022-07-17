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
    twoFactors: [false, Validators.required],
    email: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const jwt = localStorage.getItem('jwt');
    if (jwt) console.log(`My jwt: ${jwt}`);
  }

  get twoFactors() {
    return this.registerForm.value.twoFactors;
  }

  register() {
    //Submit register informations
    console.log(this.registerForm.value);
  }
}
