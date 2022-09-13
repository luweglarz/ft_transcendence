import { Injectable } from '@angular/core';
import { PopupsService } from '../popups/popups.service';
import { CollapseService } from './collapse.service';

@Injectable({
  providedIn: 'root'
})
export class WaitService {

  isInWait: boolean = false;

  constructor(private collapseService: CollapseService, private popupsService: PopupsService) {
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
