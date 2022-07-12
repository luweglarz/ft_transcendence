import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chatService/chat.service';
import { Room } from 'src/app/interface/room'
import { RoomType } from 'src/app/interface/room';
import { MatSelectionListChange } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { ChatRoomCreateComponent } from '../chat-room-create/chat-room-create.component';

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.css'],
})
export class ChatbarComponent implements OnInit {
  private roomCreate: Room = {id: 0, name: '', roomType: RoomType.PUBLIC};
  chatCollapsed = false;
  @Output() chatCollapseEvent = new EventEmitter<boolean>();
  rooms: Observable<Room[]> = this.chatService.getRooms();
  selectedRoom = null;

  constructor(private chatService: ChatService, public dialog: MatDialog) {
    //
  }

  ngOnInit(): void {
    //
  }

  openChat() {
    this.chatCollapsed = true;
    this.chatCollapseEvent.emit(this.chatCollapsed);
  }

  closeChat() {
    this.chatCollapsed = false;
    this.chatCollapseEvent.emit(this.chatCollapsed);
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChatRoomCreateComponent, {
      width: '250px',
      data: {room: this.roomCreate},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.roomCreate = result;
    })
  }
}
