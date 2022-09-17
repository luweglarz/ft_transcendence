import { Message } from 'src/app/chat/interface/message';
import { Component, Input } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
})
export class ChatMessageComponent {
  @Input() message: Message = {};
  username = '';

  constructor(private jwtService: JwtService) {
    const username = this.jwtService.username;
    if (username) this.username = username;
  }

  dateToTs(createdAt: Date | undefined): string {
    if (createdAt === undefined) return '[00:00]';
    const time: Date = new Date(createdAt);
    return '[' + time.getHours() + ':' + time.getMinutes() + ']';
  }
}
