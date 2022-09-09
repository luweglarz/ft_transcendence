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
    console.log('status socket');
    eventsService.auth.signin.subscribe(() => {
      this.jwtService
        .getToken$()
        .pipe(tap((token) => (this.ioSocket.auth = { token: token })))
        .subscribe(() => {
          this.connect();
          this.once('online', (username: any) => {
            console.log('online event: ' + username);
            const friend = this.socialService.friends.find(
              (element) => element.targetName === username,
            );
            if (friend != undefined) {
              console.log('user: ' + username + ' online');
              friend.status = 'online';
            }
          });

          this.once('offline', (username: any) => {
            const friend = this.socialService.friends.find(
              (element) => element.targetName === username,
            );
            console.log('offline event: ' + username);
            if (friend != undefined) {
              console.log('user: ' + username + ' offline');
              friend.status = 'offline';
            }
          });

          this.once('inGame', (username: any) => {
            const friend = this.socialService.friends.find(
              (element) => element.targetName === username,
            );
            console.log('inGame event: ' + username);
            if (friend != undefined) {
              console.log('user: ' + username + ' offline');
              friend.status = 'inGame';
            }
          });
          eventsService.auth.signout.subscribe(() => {
            console.log('signout event');
            this.disconnect();
          });
        });
    });
  }
}
