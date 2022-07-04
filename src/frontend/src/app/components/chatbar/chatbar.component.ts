import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.css'],
})
export class ChatbarComponent implements OnInit {
  chatCollapsed = false;
  @Output() chatCollapseEvent = new EventEmitter<boolean>();

  constructor() {
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
}
