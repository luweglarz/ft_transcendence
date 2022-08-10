import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { ProfilInfoService } from '../profil-info.service';

interface User {
  username: string;
  id: number;
}

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css'],
})
export class MatchHistoryComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    console.log('Jai fini de load');
  }

  constructor(
    public profilInfoService: ProfilInfoService,
    public avatar: AvatarService,
    private http: HttpClient,
    private jwtService: JwtService,
  ) {
    //
  }
}
