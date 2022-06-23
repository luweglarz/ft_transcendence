import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class MatchmakingService {
  constructor(private socket: Socket) {
    this.socket.on('normalGameLeft', (arg: any) => {
      console.log(arg);
    });
    this.socket.on('matchmakingLeft', (arg: any) => {
      console.log(arg);
    });
    this.socket.on('error', (arg: string) => {
      console.log(arg);
    });
  }

  requestJoinNormalMatchMaking() {
    this.socket.emit('joinNormalMatchmaking');
    this.socket.on('waitingForAMatch', (arg: any) => {
      console.log(arg);
    });
    this.socket.on('matchFound', (arg: any) => {
      console.log(arg);
    });
  }

  requestLeaveNormalMatchMaking() {
    this.socket.emit('leaveNormalMatchmaking');
  }

  requestLeaveNormalGame() {
    this.socket.emit('leaveNormalGame');
  }

  close() {
    this.socket.disconnect();
  }
}
