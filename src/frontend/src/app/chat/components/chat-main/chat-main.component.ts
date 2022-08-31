import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { Observable } from 'rxjs';
import { Room } from 'src/app/chat/interface/room';
import { ChatService } from 'src/app/chat/chatService/chat.service';
import { ChatRoomCreateComponent } from '../chat-room-create/chat-room-create.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css'],
})
export class ChatMainComponent implements OnInit, OnDestroy {
  rooms: Observable<Room[]> = this.chatService.getRooms();
  createdRoom: Promise<Room> = this.chatService.getCreatedRoomFirst();
  selectedRoom: Room = {};

  constructor(private chatService: ChatService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.chatService.openChat();
  }

  onSelectRoom(event: MatSelectionListChange) {
    //console.log('MLT', JSON.parse(JSON.stringify(event.source.selectedOptions.selected[0].value)));
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChatRoomCreateComponent, {
      width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      //this.roomCreate = result;
      console.log(result);
      if (result !== undefined) {
        if (result !== 'no') {
          console.log('result'); // selectedroom must become the newly created room
          this.chatService.getCreatedRoom().subscribe((resultRoom) => {
            console.log('Roomresult');
            this.selectedRoom = resultRoom;
          });
          if (this.selectedRoom.id === undefined) {
            this.createdRoom.then((resultRoom) => {
              console.log('Roomresult');
              this.selectedRoom = resultRoom;
            });
          }
          console.log(this.selectedRoom);
        }
      }
    });
  }

  joinRoomInvite(newRoom: Room) {
    this.selectedRoom = newRoom;
  }

  ngOnDestroy(): void {
    this.selectedRoom = {}; // probably useless
  }
}
