import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupsService {
  constructor() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
  }

  public profilPopup;
  public ladderPopup;
  public socialPopup;

  openProfil() {
    this.profilPopup = true;
    this.ladderPopup = false;
    this.socialPopup = false;
  }

  openLadder() {
    this.profilPopup = false;
    this.ladderPopup = true;
    this.socialPopup = false;
  }

  openSocial() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = true;
  }

  closePopup() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
  }
}
