import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private socket: Socket) {
    //Todo
  }

  public isInGame = false;

  requestLeaveNormalGame() {
    this.isInGame = false;
    this.socket.emit('leaveNormalGame');
  }

  movePaddle(event: KeyboardEvent) {
    this.socket.emit('move', event.key);
  }
}
