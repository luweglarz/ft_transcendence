import { Component, Input, Inject } from '@angular/core';
import { ChatService } from '../../chatService/chat.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Invite } from '../../interface/invite';
import { Room } from '../../interface/room';

@Component({
  selector: 'app-chat-invite',
  templateUrl: './chat-invite.component.html',
  styleUrls: ['./chat-invite.component.css'],
})
export class ChatInviteComponent {
  @Input() chatRoom: Room = {};

  constructor(
    private chatService: ChatService,
    public dialogRef: MatDialogRef<ChatInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public invites: Invite[],
  ) {}

  openInvite(invite: Invite, accept: boolean) {
    if (accept === false) {
      this.invites = this.invites.filter((inv) => inv !== invite);
      if (this.invites.length === 0)
        this.dialogRef.close({ result: 'false', invite: invite });
      this.chatService.deleteInvite(invite.id);
      return;
    }
    if (invite.challenge === true) {
      //challenge me
      this.invites = this.invites.filter((inv) => inv !== invite);
      this.dialogRef.close({ result: 'challenge', invite: invite });
      this.chatService.deleteInvite(invite.id);
      return;
    }
    // join room
    console.log(invite);
    this.dialogRef.close({ result: 'accept', invite: invite });
    this.invites = this.invites.filter((inv) => inv !== invite);
    this.chatService.deleteInvite(invite.id);
  }
}
