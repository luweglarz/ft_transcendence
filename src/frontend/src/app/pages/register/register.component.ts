import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  avatar: string = '';
  username: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  register() {
  }

}
