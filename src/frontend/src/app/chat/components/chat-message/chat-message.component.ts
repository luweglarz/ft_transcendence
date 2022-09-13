import { Message } from 'src/app/chat/interface/message';
import { Component, Input } from '@angular/core';

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
  dateToTs(createdAt: Date | undefined): string {
    if (createdAt === undefined)
      return '[00:00]';
    console.log(createdAt);
    let time: Date = new Date(createdAt);
    return '[' + time.getHours() + ':' + time.getMinutes() + ']';
  }
}
