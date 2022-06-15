import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: string = '';
  wrongCredentials: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  register() {
    this.wrongCredentials = !this.wrongCredentials;
  }

}
