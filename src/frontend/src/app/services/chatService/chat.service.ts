import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Room, RoomTab} from 'src/app/interface/room'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { this.socket.on('testfgh', () => console.log('testfgh reçu'))}

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms')
  }

  openChat() {
    this.socket.emit('getRooms');
  }

  createRoom(room: Room) {
    this.socket.emit('createRoom', room.name, room.roomType, room.password);
  }
}
