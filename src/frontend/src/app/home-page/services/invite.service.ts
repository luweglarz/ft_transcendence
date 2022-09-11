import { Injectable } from '@angular/core';
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
  ) {}

  openInvite() {
    console.log('debug');
    this.isInInvite = true;
    this.collapseService.closeChat();
    this.collapseService.closeNav();
    this.popupsService.closePopup();
  }

  closeInvite() {
    this.isInInvite = false;
  }

  selectNormal() {
    this.closeInvite();
  }

  selectFun() {
    this.closeInvite();
  }
}
