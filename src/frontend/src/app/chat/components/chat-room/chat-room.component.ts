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
import { Message } from 'src/app/chat/interface/message';
import { Room } from 'src/app/chat/interface/room';
import { ChatService } from 'src/app/chat/chatService/chat.service';
import { Observable } from 'rxjs';
import { RoomUser } from 'src/app/chat/interface/roomUser';

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
  pass: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);
  messages: Observable<Message[]> = this.chatService.getMsgs();
  roomUsers: Observable<RoomUser[]> = this.chatService.getRoomUsers();

  constructor(private chatService: ChatService) {}

  //ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['chatRoom'].previousValue !== undefined &&
      changes['chatRoom'].previousValue.name !== undefined &&
      changes['chatRoom'].previousValue.id !==
        changes['chatRoom'].currentValue.id
    ) {
      console.log('previous room', changes['chatRoom'].previousValue);
      console.log('current room', changes['chatRoom'].currentValue);
      this.chatService.leaveRoom(changes['chatRoom'].previousValue);
    }
    if (this.chatRoom.id) {
      console.log(`Join room: ${this.chatRoom.name}`);
      //if (this.chatRoom.roomType !== 'PROTECTED')
      this.chatService.joinRoom(this.chatRoom); //trigger join room on sed password for protected
    }
    this.roomUsers = this.chatService.getRoomUsers();
    this.messages = this.chatService.getMsgs();
  }

  joinProtectedRoom() {
    this.chatRoom.password = this.pass.value;
    this.chatService.joinRoom(this.chatRoom);
    this.pass.reset();
  }

  sendMessage() {
    //console.log(this.chatRoom.name);
    //console.log(this.chatMessage.value);
    if (!this.chatMessage.valid) {
      return;
    }
    if (this.chatMessage.value[0] === '/') {
      console.log('command');
      this.chatService.sendCommand(this.chatMessage.value, this.chatRoom);
    } else {
      this.chatService.sendMessage({
        content: this.chatMessage.value,
        room: this.chatRoom,
        roomId: this.chatRoom.id,
      });
    }
    this.chatMessage.reset();
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
    //console.log(this.chatRoom);
  }
}
