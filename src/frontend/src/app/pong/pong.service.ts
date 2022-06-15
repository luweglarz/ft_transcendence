import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class PongService {
  constructor(private socket: Socket) {}

  requestCreateCustomGame(roomName: string){
    this.socket.emit("createCustomGame", roomName);
    this.socket.on("newGameCreated", (arg: any) => {
      console.log("Connection established");
      console.log("Received " + arg);
    });
  }

  requestJoinGameRoom(roomName: string){
    this.socket.emit("joinGameRoom", String(roomName));
    this.socket.on("roomJoined", (arg: any) => {
      console.log("Room joined succesfully");
      console.log("Received " + arg);
    });
  }

  close() {
    this.socket.disconnect();
  }
}
