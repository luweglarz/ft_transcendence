import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Room } from 'src/app/interface/room';
import { ChatService } from 'src/app/services/chatService/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  @Input() chatRoom: Room = {};
  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    console.log(this.chatRoom.name);
    this.chatService.sendMessage({content: this.chatMessage.value, room: this.chatRoom});
    this.chatMessage.reset();
  }

}
