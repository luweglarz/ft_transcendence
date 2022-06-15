import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class PongService {
  constructor(private socket: Socket) {}

  requestCreateCustomGame() {
    this.socket.emit('createCustomGame');
    this.socket.on('newGameCreated', (arg: any) => {
      console.log('Connection established');
      console.log('Received ' + arg);
    });
  }

  requestJoinGameRoom(roomId: number) {
    this.socket.emit('joinGameRoom', String(roomId));
    this.socket.on('roomJoined', (arg: any) => {
      console.log('Room joined succesfully');
      console.log('Received ' + arg);
    });
  }

  close() {
    this.socket.disconnect();
  }
}
