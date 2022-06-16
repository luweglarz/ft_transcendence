import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class PongService {
  constructor(private socket: Socket) {}

  requestJoinNormalMatchMaking() {
    this.socket.emit('joinNormalMatchmaking');
    this.socket.on('waitingForOpponent', (arg: any) => {
      console.log('Waiting for an opponent');
    });
    this.socket.on('matchFound', (arg: any) => {
      console.log("A match has been found");
    });
  }

  close() {
    this.socket.disconnect();
  }
}
