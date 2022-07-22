import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
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
    console.log('Trying to open profil popup');
  }

  openLadder() {
    this.profilPopup = false;
    this.ladderPopup = true;
    this.socialPopup = false;
    console.log('Trying to open ladder popup');
  }

  openSocial() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = true;
    console.log('Trying to open social popup');
  }

  closePopup() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
    console.log('Trying to close popup');
  }
}
