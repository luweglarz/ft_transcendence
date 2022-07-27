import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { CollapseService } from 'src/app/home-page/collapse.service';
import { PopupsService } from 'src/app/home-page/popups/popups.service';
import { JwtService } from 'src/app/auth/jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [],
})
export class NavbarComponent implements OnInit {

  constructor(
    public jwtService: JwtService,
    public avatar: AvatarService,
    public collapseService: CollapseService,
    public popupsService: PopupsService
    ) {
    //
  }

  ngOnInit(): void {
    //
  }

  /* NAVBAR COLLAPSE */
  openSidenav(){
    this.collapseService.openNav();
  }

  closeSidenav() {
    this.collapseService.closeNav();
  }

  /* PROFIL POP UP */
  openProfil() {
    this.popupsService.openProfil();
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
