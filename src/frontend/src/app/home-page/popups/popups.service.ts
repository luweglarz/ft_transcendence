import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { MatchHistoryService } from './profil/match-history/match-history.service';

@Injectable({
  providedIn: 'root',
})
export class PopupsService {
  constructor(public matchHistoryService: MatchHistoryService, public jwtService: JwtService) {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
  }

  public profilPopup;
  public ladderPopup;
  public socialPopup;

  openProfil(username: string) {
    this.matchHistoryService.loadUserProfil(username);
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
