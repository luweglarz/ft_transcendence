import { Injectable } from '@angular/core';
import { GameSocket } from 'src/app/pong/class/game-socket';
import { PopupsService } from '../popups/popups.service';
import { CollapseService } from './collapse.service';

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
    console.log('debug');
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
    this.gameSocket.emit('invitePrivate', this.toInvite, 'normal');
    this.closeInvite();
  }

  selectFun() {
    this.gameSocket.emit('invitePrivate', this.toInvite, 'custom');
    this.closeInvite();
  }
}
