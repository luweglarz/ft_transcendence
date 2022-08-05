import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { ProfilInfoService } from './profil/profil-info.service';

@Injectable({
  providedIn: 'root',
})
export class PopupsService {
  constructor(
    public profilInfoService: ProfilInfoService,
    public jwtService: JwtService,
  ) {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
  }

  public profilPopup;
  public ladderPopup;
  public socialPopup;

  openProfil(username: string) {
    this.profilInfoService.loadUserProfil(username);
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
