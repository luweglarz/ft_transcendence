import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CollapseService {
  constructor() {
    this.navCollapsed = false;
    this.chatCollapsed = false;
  }

  public navCollapsed;
  public chatCollapsed;

  //Nav
  openNav() {
    this.navCollapsed = true;
  }

  closeNav() {
    this.navCollapsed = false;
  }

  //Chat
  openChat() {
    this.chatCollapsed = true;
  }

  closeChat() {
    this.chatCollapsed = false;
  }
}
