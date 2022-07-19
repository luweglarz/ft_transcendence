import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [],
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

  /* NAVBAR COLLAPSE */
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
    this.profilEvent.emit(this.profilPopup);
  }

  /* LADDER POP UP */
  openLadder() {
    this.profilPopup = false;
    this.ladderPopup = true;
    this.socialPopup = false;
    this.ladderEvent.emit(this.ladderPopup);
  }

  closeLadder() {
    this.ladderPopup = false;
    this.ladderEvent.emit(this.ladderPopup);
  }

  /* SOCIAL POP UP */
  openSocial() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = true;
    this.socialEvent.emit(this.socialPopup);
  }

  closeSocial() {
    this.socialPopup = false;
    this.socialEvent.emit(this.socialPopup);
  }
}
