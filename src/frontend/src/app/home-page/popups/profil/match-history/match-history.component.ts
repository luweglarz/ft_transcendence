import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';

import { AvatarService } from 'src/app/avatar/avatar.service';
import { ProfilInfoService } from '../profil-info.service';

interface User{
  username: string,
  id: number,
}

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css']
})
export class MatchHistoryComponent implements OnInit {

  users: Array<User> = [];
  username = '';

  constructor(public profilInfoService: ProfilInfoService, public avatar: AvatarService, private http: HttpClient, private jwtService: JwtService) {
    this.http.get<Array<string>>('http://localhost:3000/users/').subscribe(data => {
      for (let i = 0; i < data.length; i++){
        this.users.push({username: data[i], id: i - 1});
      }
    });
    let tmp = this.jwtService.getPayload()?.username;
    if (tmp != undefined)
      this.username = tmp;
  }

  ngOnInit(): void {
    //
  }

}
