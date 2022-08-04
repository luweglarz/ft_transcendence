import { Injectable } from '@angular/core';
//import { Socket } from 'ngx-socket-io';
import { AuthSocket } from 'src/app/class/auth-socket';
import { Room } from 'src/app/interface/room';
import { Observable } from 'rxjs';
import { Message } from 'src/app/interface/message';
import { RoomUser } from 'src/app/interface/roomUser';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: AuthSocket) {
    this.socket.on('testfgh', () => console.log('testfgh reçu'));
  }

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms');
  }

  getMsgs(): Observable<Message[]> {
    return this.socket.fromEvent<Message[]>('msgs');
  }

  getRoomUsers(): Observable<RoomUser[]> {
    return this.socket.fromEvent<RoomUser[]>('roomUsers');
  }

  openChat() {
    this.socket.emit('getRooms');
  }

  joinRoom(room: Room) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: Room) {
    this.socket.emit('leaveRoom', room);
  }

  createRoom(room: Room) {
    this.socket.emit('createRoom', room);
  }

  sendMessage(message: Message) {
    console.log(message.room);
    this.socket.emit('addMessage', message);
  }
}
