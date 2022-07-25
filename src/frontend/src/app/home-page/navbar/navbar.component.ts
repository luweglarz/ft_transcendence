import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/home-page/collapse.service';
import { PopupsService } from 'src/app/home-page/popups.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [],
})
export class NavbarComponent implements OnInit {

  constructor(public collapseService: CollapseService, public popupsService: PopupsService) {
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
