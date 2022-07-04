import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  twoFactors = false;

  //Data to retrieved
  registerForm = this.formBuilder.group({
    username: new FormControl(null, Validators.required),
    twoFactors: new FormControl(false, Validators.required),
    email: new FormControl(null, Validators.required),
  })

  constructor(private formBuilder: FormBuilder) {
    //
  }

  ngOnInit(): void {
    //
  }

  choose2FA() {
    this.twoFactors = !this.twoFactors;
  }

  register() {
    //Submit register informations
    console.log(this.registerForm.value);
  }
}
