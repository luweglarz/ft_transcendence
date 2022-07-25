import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/home-page/collapse.service';

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
  }

  closeChat() {
    this.collapseService.closeChat();
  }
}
