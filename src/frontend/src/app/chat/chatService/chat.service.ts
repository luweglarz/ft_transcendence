import { Injectable } from '@angular/core';
import { ChatSocket } from 'src/app/chat/class/auth-socket';
import { Room } from 'src/app/chat/interface/room';
import { Observable } from 'rxjs';
import { Message } from 'src/app/chat/interface/message';
import { RoomUser } from 'src/app/chat/interface/roomUser';
import { Invite } from '../interface/invite';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: ChatSocket) {
    //this.socket.connect();
  }

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms');
  }

  getMsgs(): Observable<Message[]> {
    return this.socket.fromEvent<Message[]>('msgs');
  }

  getMsg(): Observable<Message> {
    return this.socket.fromEvent<Message>('msg');
  }

  getRoomUsers(): Observable<RoomUser[]> {
    return this.socket.fromEvent<RoomUser[]>('roomUsers');
  }

  getCreatedRoom(): Observable<Room> {
    return this.socket.fromEvent<Room>('createdRoom');
  }

  getCreatedRoomFirst(): Promise<Room> {
    return this.socket.fromOneTimeEvent<Room>('createdRoom');
  }

  getCommandResult(): Promise<string> {
    return this.socket.fromOneTimeEvent<string>('resultCommand');
  }

  getBanMuteResult(): Observable<string> {
    return this.socket.fromEvent<string>('banMute');
  }

  getInvitations(): Observable<{ invite: Invite; Room: Room }> {
    return this.socket.fromEvent<{ invite: Invite; Room: Room }>('invitation');
  }

  deleteInvite(inviteId: number | undefined) {
    return this.socket.emit('inviteRemove', inviteId);
  }

  openChat() {
    this.socket.connect();
    this.socket.emit('getRooms');
  }

  closeChat() {
    this.socket.disconnect();
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

  sendCommand(command: string, room: Room) {
    const send = JSON.parse(JSON.stringify(room));
    send.command = command;
    this.socket.emit('command', send);
  }
}
