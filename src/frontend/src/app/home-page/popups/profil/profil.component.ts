import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { AvatarService } from 'src/app/avatar/avatar.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {

  username: string = 'username';
  rank: number = 1;
  elo: number = 0;
  win: number = 0;
  loss: number = 0;
  winStreak: number = 0;
  lossStreak: number = 0;


  constructor(public jwtService: JwtService, public avatar: AvatarService) {
    //
  }

  ngOnInit(): void {
    //
  }
}
