import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  //Data to retrieve
  avatar = '';
  username = '';
  twoFactors = false;
  email = '';

  registerForm = this.formBuilder.group({
    //avatar: new FormControl(null, [Validators.required, requiredFileType('png')]),
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
  }
}
