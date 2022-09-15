import { Injectable } from '@angular/core';
import { PopupsService } from 'src/app/home-page/popups/popups.service';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { GameSocket } from 'src/app/pong/class/game-socket';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  isInInvite = false;

  constructor(
    private collapseService: CollapseService,
    private popupsService: PopupsService,
    private gameSocket: GameSocket,
  ) {
    this.toInvite = '';
  }

  private toInvite: string;

  openInvite(toInvite: string) {
    this.toInvite = toInvite;
    this.isInInvite = true;
    this.collapseService.closeChat();
    this.collapseService.closeNav();
    this.popupsService.closePopup();
  }

  closeInvite() {
    this.isInInvite = false;
  }

  selectNormal() {
    this.gameSocket.emit('choosePrivateMode', this.toInvite, 'normal');
    this.closeInvite();
  }

  selectFun() {
    this.gameSocket.emit('choosePrivateMode', this.toInvite, 'custom');
    this.closeInvite();
  }
}
