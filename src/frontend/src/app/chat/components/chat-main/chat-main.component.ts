import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { Observable } from 'rxjs';
import { Room } from 'src/app/chat/interface/room';
import { Invite } from '../../interface/invite';
import { ChatService } from 'src/app/chat/chatService/chat.service';
import { ChatRoomCreateComponent } from '../chat-room-create/chat-room-create.component';
import { ChatInviteComponent } from '../chat-invite/chat-invite.component';
import { GameSocket } from 'src/app/pong/class/game-socket';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css'],
})
export class ChatMainComponent implements OnInit, OnDestroy {
  rooms: Observable<Room[]> = this.chatService.getRooms();
  //createdRoom: Promise<Room> = this.chatService.getCreatedRoomFirst();
  selectedRoom: Room = {};
  invites: Invite[] = [];
  inviteEvent = this.chatService.getInvitations().subscribe((inv) => {
    console.log(inv);
    inv.invite.room = inv.Room;
    this.invites.push(inv.invite);
  });

  constructor(
    private chatService: ChatService,
    public dialog: MatDialog,
    private gameSocket: GameSocket,
  ) {}

  ngOnInit(): void {
    this.chatService.openChat();
  }

  onSelectRoom(event: MatSelectionListChange) {
    //console.log('MLT', JSON.parse(JSON.stringify(event.source.selectedOptions.selected[0].value)));
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  async openInvites() {
    const dialogRef = this.dialog.open(ChatInviteComponent, {
      data: this.invites,
    });

    dialogRef
      .afterClosed()
      .subscribe((invite: { result: string; invite: Invite }) => {
        console.log(invite);
        if (invite === null || invite === undefined) {
          return;
        } else if (invite.result === 'challenge') {
          this.invites = this.invites.filter((inv) => inv !== invite.invite);
          const friendUsername = invite.invite.username;
          this.gameSocket.emit('acceptPrivateInvitation', friendUsername);
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
      // width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      //this.roomCreate = result;
      console.log(result);
      if (result !== undefined) {
        if (result !== 'no') {
          console.log('result'); // selectedroom must become the newly created room
          /*this.chatService.getCreatedRoom().subscribe((resultRoom) => {
            console.log('Roomresult');
            this.selectedRoom = resultRoom;
          });
          if (this.selectedRoom.id === undefined) {
            this.createdRoom.then((resultRoom) => {
              console.log('Roomresult');
              this.selectedRoom = resultRoom;
            });
          }
          this.chatService.getCreatedRoomFirst().then(async (room: Room) => {
            console.log('in then');
            this.chatService.joinRoom(room);
            this.selectedRoom = room;
          });
          while (this.selectedRoom.id === undefined) {
            console.log('empty do it again')
            this.selectedRoom = await this.chatService.getCreatedRoomFirst();
          }*/
          this.selectedRoom = result;
          console.log('why');
          console.log(this.selectedRoom);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.chatService.closeChat();
    this.selectedRoom = {}; // probably useless
  }
}
