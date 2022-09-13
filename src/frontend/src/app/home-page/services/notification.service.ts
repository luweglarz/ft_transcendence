import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  //Audio
  gameFoundSound: HTMLAudioElement = new Audio(
    'assets/sounds/gamefound.wav',
  );
  inviteReceivedSound: HTMLAudioElement = new Audio(
    'assets/sounds/invitation.wav',
  );

  constructor(private title: Title) {}

  //Game
  gameFound() {
    this.gameFoundSound.play();
    this.title.setTitle('Game is starting..');
    setTimeout(() => {
      this.title.setTitle('42Pong');
    }, 3000);
  }

  //Invite
  inviteReceived() {
    this.inviteReceivedSound.play();
    this.title.setTitle('Invitation received !');
    setTimeout(() => {
      this.title.setTitle('42Pong');
    }, 3000);
  }
}
