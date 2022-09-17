import { EventEmitter, Injectable } from '@angular/core';
import { StatusSocket } from 'src/app/home-page/popups/social/class/status-socket';
import { EventsService } from 'src/app/services/events.service';
import { JwtService } from '../jwt';

@Injectable({
  providedIn: 'root',
})
export class SignoutService {
  private readonly signoutEvent: EventEmitter<boolean>;
  constructor(
    private jwt: JwtService,
    private readonly events: EventsService,
    private statusSocket: StatusSocket,
  ) {
    this.signoutEvent = this.events.auth.signout;
  }

  signOut() {
    // const username = this.jwt.username;
    this.statusSocket.disconnect();
    this.jwt.clearToken();
    this.signoutEvent.emit(true);
    // if (username) console.log(`${username} successfully signed out`);
  }
}
