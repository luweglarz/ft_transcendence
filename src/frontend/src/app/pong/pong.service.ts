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
    this.socket.on('waitingForAMatch', (arg: any) => {
      console.log(arg);
    });
    this.socket.on('matchFound', (arg: any) => {
      console.log(arg);
    });
    this.socket.on('matchmakingAlreadyJoined', (arg: any) => {
      console.log(arg);
    });
    this.socket.on('alreadyInGame', (arg: any) => {
      console.log(arg);
    });
  }

  requestLeaveNormalMatchMaking() {
    this.socket.emit('leaveNormalMatchmaking');
    this.socket.on('matchmakingLeft', (arg: any) => {
      console.log(arg);
    });
  }

  requestLeaveNormalGame() {
    this.socket.emit('leaveNormalGame');
    this.socket.on('normalGameLeft', (arg: any) => {
      console.log(arg);
    });
  }

  close() {
    this.socket.disconnect();
  }
}
