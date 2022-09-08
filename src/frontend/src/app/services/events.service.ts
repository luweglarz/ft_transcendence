import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  auth = {
    signin: new EventEmitter<boolean>(),
    signout: new EventEmitter<boolean>(),
  };
  avatar = {
    upload: new EventEmitter<string>(),
  };

  // constructor() {}
}
