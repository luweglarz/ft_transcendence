import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Message } from 'src/app/interface/message';
import { Room } from 'src/app/interface/room';
import { ChatService } from 'src/app/services/chatService/chat.service';
import { Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnChanges {

  @Input() chatRoom: Room = {};
  chatMessage: FormControl = new FormControl(null, [Validators.required]);
  messages: Observable<Message[]> = this.chatService.getMsgs();

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatRoom'].previousValue)
      this.chatService.leaveRoom(changes['chatRoom'].previousValue);
    //this.messages = of([]);
    if (this.chatRoom.id)
      this.chatService.joinRoom(this.chatRoom);
    this.messages = this.chatService.getMsgs();
  }

  sendMessage() {
    //console.log(this.chatRoom.name);
    //console.log(this.chatMessage.value);
    this.chatService.sendMessage({content: this.chatMessage.value, room: this.chatRoom, roomId: this.chatRoom.id});
    this.chatMessage.reset();
    //console.log(this.chatRoom);
  }

}
