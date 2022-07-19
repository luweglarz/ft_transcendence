import { Component, OnInit } from '@angular/core';
import { JwtPayload, JwtService } from '../jwt';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit {
  payload?: JwtPayload;
  is_valid = false;
  expiration = '';

  constructor(private jwt: JwtService) {}

  ngOnInit(): void {
    this.payload = this.jwt.getPayload();
    this.is_valid = this.jwt.isValid();
    this.expiration = this.jwt.expirationString();
    console.table(this.payload);
  }
}
