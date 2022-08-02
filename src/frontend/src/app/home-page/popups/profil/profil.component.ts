import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { MatchHistoryService } from './match-history/match-history.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {

  constructor(public jwtService: JwtService, public avatar: AvatarService, public matchHistoryService: MatchHistoryService) {
    //
  }

  ngOnInit(): void {
    //
  }
}
