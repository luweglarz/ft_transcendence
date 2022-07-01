import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('150ms',
          style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('150ms',
          style({opacity: 0})
        )
      ])
    ]),
  ]
})
export class NavbarComponent implements OnInit {
  collapsed = false;
  @Output() collapseEvent = new EventEmitter<boolean>();

  profilPopup = false;
  @Output() profilEvent = new EventEmitter<boolean>();
  ladderPopup = false;
  @Output() ladderEvent = new EventEmitter<boolean>();
  socialPopup = false;
  @Output() socialEvent = new EventEmitter<boolean>();

  ngOnInit(): void {

  }

  sendToParent(collapsed: boolean){
    this.collapseEvent.emit(this.collapsed);
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.sendToParent(this.collapsed);
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.sendToParent(this.collapsed);
  }

  // SEND POP UPS
  sendProfilPopup() {
    this.profilEvent.emit(this.profilPopup);
  }

  sendLadderPopup() {
    this.ladderEvent.emit(this.ladderPopup);
  }

  sendSocialPopup() {
    this.socialEvent.emit(this.socialPopup);
  }

  /* PROFIL POP UP */
  openProfil() {
    this.profilPopup = true;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.sendProfilPopup();
  }

  closeProfil() {
    this.profilPopup = false;
    this.sendProfilPopup();
  }

  /* LADDER POP UP */
  openLadder() {
    this.ladderPopup = true;
    this.profilPopup = false;
    this.socialPopup = false;
    this.sendLadderPopup();
  }

  closeLadder() {
    this.ladderPopup = false;
    this.sendLadderPopup();
  }

  /* SOCIAL POP UP */
  openSocial() {
    this.socialPopup = true;
    this.profilPopup = false;
    this.ladderPopup = false;
    this.sendSocialPopup();
  }

  closeSocial() {
    this.socialPopup = false;
    this.sendSocialPopup();
  }

}
