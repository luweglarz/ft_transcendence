import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  //Nav
  navCollapsed = false;

  //Chat
  chatCollapsed = false;

  //Pop ups
  profilPopup = false;
  ladderPopup = false;
  socialPopup = false;

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  //RECIEVE COLLAPSING
  recieveNavCollapse(collapse: boolean) {
    this.navCollapsed = collapse;
  }

  //CHAT CHAT COLLAPSING
  recieveChatCollapse(collapse: boolean) {
    this.chatCollapsed = collapse;
  }

  //RECIEVE POP UP
  recieveProfilPopup(profil: boolean) {
    console.log('JE DOIS OUVRIR LE PROFIL');
    this.profilPopup = profil;
    if (this.profilPopup) {
      this.ladderPopup = false;
      this.socialPopup = false;
    }
  }

  recieveLadderPopup(ladder: boolean) {
    console.log('JE DOIS OUVRIR LE LADDER');
    this.ladderPopup = ladder;
    if (this.ladderPopup) {
      this.profilPopup = false;
      this.socialPopup = false;
    }
  }

  recieveSocialPopup(social: boolean) {
    console.log('JE DOIS OUVRIR LE SOCIAL');
    this.socialPopup = social;
    if (this.socialPopup) {
      this.profilPopup = false;
      this.ladderPopup = false;
    }
  }

  // PROFIL POP UP
  closePopup() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
  }
}
