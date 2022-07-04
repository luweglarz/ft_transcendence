import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  //Data to retrieve
  avatar = '';
  username = '';
  email = '';

  //Utils
  twoFactors = false;

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  choose2FA() {
    this.twoFactors = !this.twoFactors;
  }

  register() {

  }
}
