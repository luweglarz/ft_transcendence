import { EventEmitter, Injectable } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { JwtService } from '../jwt';

@Injectable({
  providedIn: 'root',
})
export class SignoutService {
  private readonly signoutEvent: EventEmitter<boolean>;
  constructor(private jwt: JwtService, private readonly events: EventsService) {
    this.signoutEvent = this.events.auth.signout;
  }

  signOut() {
    const username = this.jwt.username;
    this.jwt.clearToken();
    this.signoutEvent.emit(true);
    if (username) console.log(`${username} successfully signed out`);
  }
}
