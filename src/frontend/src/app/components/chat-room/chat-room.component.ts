import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Message } from 'src/app/interface/message';
import { Room } from 'src/app/interface/room';
import { ChatService } from 'src/app/services/chatService/chat.service';
import { Observable } from 'rxjs';
import { RoomUser } from 'src/app/interface/roomUser';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnChanges {
  @Input() chatRoom: Room = {};
  @ViewChild('mesgs') private scrollContainer: ElementRef = new ElementRef(
    'mesgs',
  );
  chatMessage: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);
  messages: Observable<Message[]> = this.chatService.getMsgs();
  roomUsers: Observable<RoomUser[]> = this.chatService.getRoomUsers();

  constructor(private chatService: ChatService) {}

  //ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatRoom'].previousValue)
      this.chatService.leaveRoom(changes['chatRoom'].previousValue);
    if (this.chatRoom.id) {
      console.log(`Join room: ${this.chatRoom.name}`);
      this.chatService.joinRoom(this.chatRoom);
    }
    this.messages = this.chatService.getMsgs();
  }

  sendMessage() {
    //console.log(this.chatRoom.name);
    //console.log(this.chatMessage.value);
    this.chatService.sendMessage({
      content: this.chatMessage.value,
      room: this.chatRoom,
      roomId: this.chatRoom.id,
    });
    this.chatMessage.reset();
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
    //console.log(this.chatRoom);
  }
}
