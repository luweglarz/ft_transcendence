import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { JwtService } from 'src/app/auth/jwt';
import { environment } from 'src/environments/environment';
import { EventsService } from 'src/app/services/events.service';
import { SocialService } from '../social.service';

@Injectable({
  providedIn: 'root',
})
export class StatusSocket extends Socket {
  constructor(
    private jwtService: JwtService,
    eventsService: EventsService,
    private socialService: SocialService,
  ) {
    super({
      url: environment.backend,
      options: {
        autoConnect: false,
        path: environment.socketStatusPath,
        transports: ['websocket', 'polling'],
      },
    });
    eventsService.auth.signin.subscribe(() => {
      this.jwtService
        .getToken$()
        .pipe(tap((token) => (this.ioSocket.auth = { token: token })))
        .subscribe(() => {
          this.connect();
        });
    });
    eventsService.auth.signout.subscribe(() => {
      this.jwtService
        .getToken$()
        .pipe(tap((token) => (this.ioSocket.auth = { token: token })))
        .subscribe(() => {
          this.disconnect();
        });
    });
    this.onOnlineEvent();
    this.onOfflineEvent();
    this.onInGameEvent();
  }

  onOnlineEvent() {
    this.on('online', (username: any) => {
      const friend = this.socialService.friends.find(
        (element) => element.targetName === username,
      );
      if (friend != undefined) friend.status = 'online';
    });
  }

  onOfflineEvent() {
    this.on('offline', (username: any) => {
      const friend = this.socialService.friends.find(
        (element) => element.targetName === username,
      );
      if (friend != undefined) friend.status = 'offline';
    });
  }

  onInGameEvent() {
    this.on('inGame', (username: any) => {
      const friend = this.socialService.friends.find(
        (element) => element.targetName === username,
      );
      if (friend != undefined) friend.status = 'ingame';
    });
  }
}
