import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Room} from 'src/app/interface/room'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms')
  }
}
