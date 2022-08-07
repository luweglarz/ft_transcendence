import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent {
  username = 'username';
  rank = 1;
  elo = 0;
  win = 0;
  loss = 0;
  winStreak = 0;
  lossStreak = 0;

  constructor(public jwtService: JwtService) {}
}
