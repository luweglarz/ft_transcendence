import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/collapse.service';
import { PopupsService } from 'src/app/popups.service';

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
    console.log(this.collapseService.navCollapsed);
  }

  closeSidenav() {
    this.collapseService.closeNav();
    console.log(this.collapseService.navCollapsed);
  }

  /* PROFIL POP UP */
  openProfil() {
    this.popupsService.openProfil();
    console.log(this.popupsService.profilPopup, this.popupsService.ladderPopup, this.popupsService.socialPopup);
  }

  /* LADDER POP UP */
  openLadder() {
    this.popupsService.openLadder();
    console.log(this.popupsService.profilPopup, this.popupsService.ladderPopup, this.popupsService.socialPopup);
  }

  /* SOCIAL POP UP */
  openSocial() {
    this.popupsService.openSocial();
    console.log(this.popupsService.profilPopup, this.popupsService.ladderPopup, this.popupsService.socialPopup);
  }

}
