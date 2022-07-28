import { Message } from 'src/app/interface/message';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomUser } from 'src/app/interface/roomUser';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
})
export class ChatMessageComponent /*implements OnInit*/ {
  @Input() message: Message = {};
  @Input() roomUsers: Observable<RoomUser[]> = new Observable<RoomUser[]>();
  //constructor() {}
  //ngOnInit(): void {}
  //findUser(message: Message): RoomUser {
  //  this.roomUsers
  //  return ({});
  //}
}
