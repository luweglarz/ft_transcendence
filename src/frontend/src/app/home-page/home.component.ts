import { Component, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { PopupsService } from 'src/app/home-page/popups/popups.service';
import { GameService } from 'src/app/pong/game/game.service';
import { StatusSocket } from './popups/social/class/status-socket';
import { JwtService } from '../auth/jwt';
import { tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    public gameService: GameService,
    public collapseService: CollapseService,
    public popupsService: PopupsService,
    private statusSocket: StatusSocket,
    private jwtService: JwtService,
  ) {
    //
  }

  ngOnInit(): void {
    // if (this.gameService.isInGame.getValue() === false) return;
    this.jwtService
      .getToken$()
      .pipe(
        tap((token) => (this.statusSocket.ioSocket.auth = { token: token })),
      )
      .subscribe(() => {
        this.statusSocket.connect();
      });
  }

  // PROFIL POP UP
  closePopup() {
    this.popupsService.closePopup();
  }

  debug() {
    console.log(this.gameService.isInGame.getValue());
  }
}
