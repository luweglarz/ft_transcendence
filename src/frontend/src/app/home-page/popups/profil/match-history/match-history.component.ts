import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { User } from 'src/app/home-page/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { ProfilInfoService } from '../profil-info.service';

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css'],
})
export class MatchHistoryComponent {
  users: Array<User> = [];
  isLoaded = false;

  constructor(
    public profilInfoService: ProfilInfoService,
    public avatar: AvatarService,
    private http: HttpClient,
  ) {
    this.http
      .get<Array<string>>(`${environment.backend}/users/`)
      .subscribe((data) => {
        for (let i = 0; i < data.length; i++)
          this.users.push({ username: data[i], id: i + 1 });
        this.isLoaded = true;
      });
  }

  getUsernameById(id: number): string {
    try {
      return this.users[id - 1].username;
    } catch (e) {
      return '';
    }
  }
}
