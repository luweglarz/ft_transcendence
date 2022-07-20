import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../jwt';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css'],
})
export class SignOutComponent implements OnInit {
  constructor(private jwt: JwtService, private router: Router) {}

  ngOnInit(): void {
    this.jwt.clearToken();
    this.router.navigate(['/auth/signin']);
  }
}
