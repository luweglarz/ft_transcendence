import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { Observable, Subscription } from 'rxjs';
import { Room } from 'src/app/chat/interface/room';
import { Invite } from '../../interface/invite';
import { ChatService } from 'src/app/chat/chatService/chat.service';
import { ChatRoomCreateComponent } from '../chat-room-create/chat-room-create.component';
import { ChatInviteComponent } from '../chat-invite/chat-invite.component';
import { NotificationService } from 'src/app/home-page/services/notification.service';
import { GameSocket } from 'src/app/pong/class/game-socket';
import { WaitService } from 'src/app/pong/matchmaking/wait/wait.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css'],
})
export class ChatMainComponent implements OnInit, OnDestroy {
  rooms: Observable<Room[]> = this.chatService.getRooms();
  selectedRoom: Room = {};
  invites: Invite[] = [];
  inviteEvent?: Subscription;
  kickLeaveEvent?: Subscription;
  constructor(
    private chatService: ChatService,
    public dialog: MatDialog,
    private notification: NotificationService,
    private gameSocket: GameSocket,
    private waitService: WaitService,
  ) {}

  ngOnInit(): void {
    this.inviteEvent = this.chatService.getInvitations().subscribe((inv) => {
      this.notification.inviteReceived();
      inv.invite.room = inv.Room;
      this.invites.push(inv.invite);
    });
    this.kickLeaveEvent = this.chatService.kickLeaveEvent().subscribe(() => {
      this.selectedRoom = {};
    });
    this.chatService.openChat();
  }

  ngOnDestroy(): void {
    this.chatService.closeChat();
    this.selectedRoom = {}; // probably useless
    this.inviteEvent?.unsubscribe();
    this.kickLeaveEvent?.unsubscribe();
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  async openInvites() {
    const dialogRef = this.dialog.open(ChatInviteComponent, {
      data: this.invites,
    });

    dialogRef
      .afterClosed()
      .subscribe((invite: { result: string; invite: Invite }) => {
        if (invite === null || invite === undefined) {
          return;
        } else if (invite.result === 'challenge') {
          this.invites = this.invites.filter((inv) => inv !== invite.invite);
          const friendUsername = invite.invite.username;
          this.gameSocket.emit('acceptPrivateInvitation', friendUsername);
          this.waitService.openWait();
          return;
        } else if (invite.result === 'false') {
          this.invites = this.invites.filter((inv) => inv !== invite.invite);
          return;
        } else if (invite.result === 'accept') {
          this.invites = this.invites.filter((inv) => inv !== invite.invite);
          this.selectedRoom = invite.invite.room;
        }
      });
  }

  async openDialog() {
    const dialogRef = this.dialog.open(ChatRoomCreateComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (result !== 'no') {
          this.selectedRoom = result;
        }
      }
    });
  }
}
