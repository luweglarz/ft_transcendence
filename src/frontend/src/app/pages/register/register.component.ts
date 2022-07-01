import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  avatar = '';
  username = '';

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  register() {
    console.log(this.avatar);
    console.log(this.username)
  }
}
