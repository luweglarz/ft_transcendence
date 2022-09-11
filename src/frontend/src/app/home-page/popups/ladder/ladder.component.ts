import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { GameComponent } from 'src/app/pong/game/game.component';
import { environment } from 'src/environments/environment';
import { PopupsService } from '../popups.service';
import { SocialService } from '../social/social.service';

interface Player {
  nbLoses: number;
  nbWins: number;
  score: number;
  username: string;

  showButtons: boolean;
}

@Component({
  selector: 'app-ladder',
  templateUrl: './ladder.component.html',
  styleUrls: ['./ladder.component.css'],
})
export class LadderComponent implements OnInit {
  username = '';
  ladder: Array<Player> = [];
  isLoaded = false;

  buttons = false;

  constructor(
    private http: HttpClient,
    public popupsService: PopupsService,
    public jwtService: JwtService,
    public socialService: SocialService,
    public gameComponent: GameComponent,
  ) {
    const tmp = this.jwtService.username;
    if (tmp != undefined) this.username = tmp;
    this.http
      .get<Array<Player>>(`${environment.backend}/game/ladder`)
      .subscribe((data) => {
        this.ladder = data;
        this.isLoaded = true;
      });
  }

  ngOnInit(): void {
    //
  }

  colorPodium(index: number): string {
    if (index === 1) return 'first';
    else if (index === 2) return 'second';
    else if (index === 3) return 'third';
    else return '';
  }

  displayButtons() {
    this.buttons = true;
  }

  displayPlayer() {
    this.buttons = false;
  }
}
