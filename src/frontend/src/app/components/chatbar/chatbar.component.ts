import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chatService/chat.service';
import { Room } from 'src/app/interface/room'
import { MatSelectionListChange } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.css'],
})
export class ChatbarComponent implements OnInit {
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

  }
}
