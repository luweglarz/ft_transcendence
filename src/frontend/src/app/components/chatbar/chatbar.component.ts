import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/collapse.service';

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.css'],
})
export class ChatbarComponent implements OnInit {

  constructor(public collapseService: CollapseService) {
    //
  }

  ngOnInit(): void {
    //
  }

  openChat() {
    this.collapseService.openChat();
    console.log(this.collapseService.chatCollapsed);
  }

  closeChat() {
    this.collapseService.closeChat();
    console.log(this.collapseService.chatCollapsed);
  }
}
