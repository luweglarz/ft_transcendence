import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignoutService } from './signout.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css'],
})
export class SignOutComponent implements OnInit {
  constructor(private service: SignoutService, private router: Router) {}

  ngOnInit(): void {
    this.service.signOut();
    this.router.navigate(['/auth/signin'], { replaceUrl: true });
  }
}
