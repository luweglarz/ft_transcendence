import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from 'src/app/auth/jwt';
import { ProfilInfoService } from './profil/profil-info.service';
import { SocialService } from './social/social.service';

@Injectable({
  providedIn: 'root',
})
export class PopupsService {
  public popup?: 'profile' | 'ladder' | 'social' | 'settings';

  constructor(
    public profilInfoService: ProfilInfoService,
    public jwtService: JwtService,
    public socialService: SocialService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  private routeTo(
    component: 'profile' | 'ladder' | 'social' | 'settings',
    opts?: { username?: string },
  ) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { popup: component, ...opts },
    });
  }

  openPopup(name: typeof this.popup, username?: string): void {
    this.popup = name;
    if (name == 'profile' && username)
      this.profilInfoService.loadUserProfil(username);
    else if (name == 'social' && username)
      this.socialService.loadUserSocial(username);
  }

  openProfil(username: string) {
    this.routeTo('profile', { username: username });
  }

  openLadder() {
    this.routeTo('ladder');
  }

  openSocial(username: string) {
    this.routeTo('social', { username: username });
  }

  openSettings() {
    this.routeTo('settings');
  }

  closePopup() {
    this.router.navigate([], {
      relativeTo: this.route,
      // queryParams: { close: true },
    });
    this.popup = undefined;
  }
}
