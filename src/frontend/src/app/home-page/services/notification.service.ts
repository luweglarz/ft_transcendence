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
  invitationSound: HTMLAudioElement = new Audio(
    'assets/sounds/invitation.wav',
  );

  //Notifications
  msgNotification = 0;

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
    this.invitationSound.play();
    this.title.setTitle('Invitation received !');
    setTimeout(() => {
      this.title.setTitle('42Pong');
    }, 3000);
  }
}
