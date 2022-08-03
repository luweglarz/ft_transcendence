import { Message } from 'src/app/interface/message';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
})
export class ChatMessageComponent /*implements OnInit*/ {
  @Input() message: Message = {};
  //constructor() {}
  //ngOnInit(): void {}
  //findUser(message: Message): RoomUser {
  //  this.roomUsers
  //  return ({});
  //}
}
