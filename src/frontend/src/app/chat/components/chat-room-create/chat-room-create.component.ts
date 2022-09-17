import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Room } from 'src/app/chat/interface/room';
import { RoomType } from 'src/app/chat/interface/room';
import { ChatService } from 'src/app/chat/chatService/chat.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-chat-room-create',
  templateUrl: './chat-room-create.component.html',
  styleUrls: ['./chat-room-create.component.css'],
})
export class ChatRoomCreateComponent {
  roomTypes = Object.values(RoomType);
  roomNameAvailable = true;

  constructor(
    public dialogRef: MatDialogRef<ChatRoomCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Room = {},
    private chatService: ChatService,
  ) {}

  async onSend(userForm: NgForm) {
    if (userForm.status === 'INVALID') return;
    this.roomNameAvailable = await this.chatService.roomNameAvailable(
      this.data.name,
    );
    if (this.roomNameAvailable) {
      this.chatService.createRoom(this.data);
      this.chatService
        .getCreatedRoom()
        .pipe(take(1))
        .subscribe((room: Room) => {
          this.dialogRef.close(room);
        });
    }
  }

  onNoClick(): void {
    this.dialogRef.close('no');
  }
}
