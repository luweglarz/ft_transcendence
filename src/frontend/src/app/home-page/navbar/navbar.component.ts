import { Component } from '@angular/core';
import { CollapseService } from 'src/app/home-page/collapse.service';
import { PopupsService } from 'src/app/home-page/popups/popups.service';
import { JwtService } from 'src/app/auth/jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [],
})
export class NavbarComponent {
  constructor(
    public jwtService: JwtService,
    public collapseService: CollapseService,
    public popupsService: PopupsService,
  ) {}

  /* NAVBAR COLLAPSE */
  openSidenav() {
    this.collapseService.openNav();
  }

  closeSidenav() {
    this.collapseService.closeNav();
  }

  /* PROFIL POP UP */
  openProfil(username: string) {
    this.popupsService.openProfil(username);
  }

  /* LADDER POP UP */
  openLadder() {
    this.popupsService.openLadder();
  }

  /* SOCIAL POP UP */
  openSocial() {
    this.popupsService.openSocial();
  }
}
