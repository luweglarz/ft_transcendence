import { Component, Input, OnInit } from '@angular/core';
import { Room } from 'src/app/interface/room';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  @Input() chatRoom: Room = {};

  constructor() { }

  ngOnInit(): void {
  }

}
