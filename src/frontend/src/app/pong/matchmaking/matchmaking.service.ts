import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class MatchmakingService {
  public isInGame = false;

  constructor(private socket: Socket, private router: Router) {
    this.socket.on('normalGameLeft', (arg: any) => {
      console.log(arg);
      this.router.navigate(['matchmaking']);
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
      this.isInGame = true;
      this.router.navigate(['game']);
      console.log(arg);
    });
  }

  requestLeaveNormalMatchMaking() {
    this.socket.emit('leaveNormalMatchmaking');
  }
}
