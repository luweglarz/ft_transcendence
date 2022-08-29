import {
    Component, Input, OnChanges, SimpleChanges
  } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from '../../chatService/chat.service';
import { Invite } from '../../interface/invite';
import { Room } from '../../interface/room';

@Component({
    selector: 'app-chat-invite',
    templateUrl: './chat-invite.component.html',
    styleUrls: ['./chat-invite.component.css'],
})

  export class ChatInviteComponent implements OnChanges {
    @Input() chatRoom: Room = {};
    invites: Invite[] = [];
    inviteEvent = this.chatservice.getInvitations().subscribe((inv)=> {
      console.log('WHY');
      this.invites.push(inv);
    });

    constructor(private chatservice: ChatService) {}

    ngOnChanges(changes: SimpleChanges): void {
      this.invites = this.invites.filter(inv => inv.roomId !== changes['chatRoom'].currentValue.id);
    }
  }