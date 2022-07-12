import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Room } from 'src/app/interface/room';

@Component({
  selector: 'app-chat-room-create',
  templateUrl: './chat-room-create.component.html',
  styleUrls: ['./chat-room-create.component.css']
})
export class ChatRoomCreateComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChatRoomCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Room,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
