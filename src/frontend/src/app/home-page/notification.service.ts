import { Injectable } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  //Audio
  gameFoundSound: HTMLAudioElement = new Audio('assets/sounds/notification.mp3');

  //Notifications
  msgNotification: number = 0;

  constructor(private title:Title) { }

  //Message
  updateTitle(){
    if (this.msgNotification != 0){
      return ('(' + this.msgNotification + ') 42Pong');
    }
    else {
      return ('42Pong');
    }
  }

  //Game
  gameFound() {
    this.gameFoundSound.play();
    this.title.setTitle('Game is starting..');
    setTimeout(() => {
      this.title.setTitle(this.updateTitle());
    } , 3000);
  }
}
