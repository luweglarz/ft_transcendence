import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { ProfilInfoService } from '../profil-info.service';

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css'],
})

export class MatchHistoryComponent {

  constructor(
    public profilInfoService: ProfilInfoService,
    public avatar: AvatarService,
    private http: HttpClient,
    private jwtService: JwtService,
  ) {
    //
  }

}
