import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Room, Message, User } from '@prisma/client'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  
}
