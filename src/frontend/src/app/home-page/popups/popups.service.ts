import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { ProfilInfoService } from './profil/profil-info.service';
import { SocialService } from './social/social.service';

@Injectable({
  providedIn: 'root',
})
export class PopupsService {
  constructor(
    public profilInfoService: ProfilInfoService,
    public jwtService: JwtService,
    public socialService: SocialService,
  ) {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.settingsPopup = false;
  }

  public profilPopup;
  public ladderPopup;
  public socialPopup;
  public settingsPopup;

  openProfil(username: string) {
    this.profilInfoService.loadUserProfil(username);
    this.profilPopup = true;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.settingsPopup = false;
  }

  openLadder() {
    this.profilPopup = false;
    this.ladderPopup = true;
    this.socialPopup = false;
    this.settingsPopup = false;
  }

  openSocial(username: string) {
    this.socialService.loadUserSocial(username);
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = true;
    this.settingsPopup = false;
  }

  openSettings() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.settingsPopup = true;
  }

  closePopup() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.settingsPopup = false;
  }
}
