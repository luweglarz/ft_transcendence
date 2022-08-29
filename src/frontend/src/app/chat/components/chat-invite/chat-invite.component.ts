import {
    Component, EventEmitter, Input, OnChanges, Output, SimpleChanges
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
    @Output() roomInvite = new EventEmitter<Room>();
    invites: Invite[] = [];
    inviteEvent = this.chatservice.getInvitations().subscribe((inv)=> {
      console.log(inv);
      inv.invite.room = inv.Room;
      this.invites.push(inv.invite);
    });

    constructor(private chatservice: ChatService) {}

    ngOnChanges(changes: SimpleChanges): void {
      this.invites = this.invites.filter(inv => inv.roomId !== changes['chatRoom'].currentValue.id);
    }

    openInvite(invite: Invite, accept: boolean) {
      if (accept === false) {
        this.invites = this.invites.filter(inv => inv !== invite);
        return ;
      }
      if (invite.challenge === true) {
        //challenge me
        this.invites = this.invites.filter(inv => inv !== invite);
        return ;
      }
      // join room
      console.log(invite);
      this.roomInvite.emit(invite.room);
      this.invites = this.invites.filter(inv => inv !== invite);
    }
  }