import { Component, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { PopupsService } from 'src/app/home-page/popups/popups.service';
import { GameService } from 'src/app/pong/game/game.service';
import { InviteService } from './services/invite.service';
import { WaitService } from './services/wait.service';

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
    public inviteService: InviteService,
    public waitService: WaitService
  ) {
    //
  }

  ngOnInit(): void {
    //
  }

  // PROFIL POP UP
  closePopup() {
    this.popupsService.closePopup();
  }
}
