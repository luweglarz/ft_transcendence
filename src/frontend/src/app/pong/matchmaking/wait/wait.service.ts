import { Injectable } from '@angular/core';
import { PopupsService } from '../../../home-page/popups/popups.service';
import { CollapseService } from '../../../home-page/services/collapse.service';

@Injectable({
  providedIn: 'root',
})
export class WaitService {
  isInWait = false;

  constructor(
    private collapseService: CollapseService,
    private popupsService: PopupsService,
  ) {
    //
  }

  openWait() {
    this.isInWait = true;
    this.collapseService.closeChat();
    this.collapseService.closeNav();
    this.popupsService.closePopup();
  }

  closeWait() {
    this.isInWait = false;
  }
}
