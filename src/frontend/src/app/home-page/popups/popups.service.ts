import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute,
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

  routeTo(
    component: 'profile' | 'ladder' | 'social' | 'settings',
    opts?: { username?: string },
  ) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { popup: component, ...opts },
    });
  }

  openProfil(username: string) {
    this.routeTo('profile', { username: username });
    this.profilInfoService.loadUserProfil(username);
    this.profilPopup = true;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.settingsPopup = false;
  }

  openLadder() {
    this.routeTo('ladder');
    this.profilPopup = false;
    this.ladderPopup = true;
    this.socialPopup = false;
    this.settingsPopup = false;
  }

  openSocial(username: string) {
    this.routeTo('social', { username: username });
    this.socialService.loadUserSocial(username);
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = true;
    this.settingsPopup = false;
  }

  openSettings() {
    this.routeTo('settings');
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.settingsPopup = true;
  }

  closePopup() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.settingsPopup = false;
  }
}
