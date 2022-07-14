import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('150ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
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

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapseEvent.emit(this.collapsed);
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.collapseEvent.emit(this.collapsed);
  }

  /* PROFIL POP UP */
  openProfil() {
    this.profilPopup = true;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.profilEvent.emit(this.profilPopup);
  }

  closeProfil() {
    this.profilPopup = false;
    this.ladderEvent.emit(this.profilPopup);
  }

  /* LADDER POP UP */
  openLadder() {
    this.ladderPopup = true;
    this.profilPopup = false;
    this.socialPopup = false;
    this.socialEvent.emit(this.ladderPopup);
  }

  closeLadder() {
    this.ladderPopup = false;
    this.socialEvent.emit(this.ladderPopup);
  }

  /* SOCIAL POP UP */
  openSocial() {
    this.socialPopup = true;
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialEvent.emit(this.socialPopup);
  }

  closeSocial() {
    this.socialPopup = false;
    this.socialEvent.emit(this.socialPopup);
  }
}
