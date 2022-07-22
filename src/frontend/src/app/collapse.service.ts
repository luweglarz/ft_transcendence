import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
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
    console.log('Trying to open nav');
  }

  closeNav() {
    this.navCollapsed = false;
    console.log('Trying to close nav');
  }

  //Chat
  openChat() {
    this.chatCollapsed = true;
    console.log('Trying to open chat');
  }

  closeChat() {
    this.chatCollapsed = false;
    console.log('Trying to close chat');
  }
}
