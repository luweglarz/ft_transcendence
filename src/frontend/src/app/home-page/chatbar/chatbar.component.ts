import { CollapseService } from 'src/app/home-page/collapse.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.css'],
})
export class ChatbarComponent implements OnInit {
  chatCollapsed = false;
  @Output() chatCollapseEvent = new EventEmitter<boolean>();

  constructor(
    public dialog: MatDialog,
    public collapseService: CollapseService,
  ) {
    //
  }

  ngOnInit(): void {
    //
  }

  openChat() {
    this.chatCollapsed = true;
    this.collapseService.openChat();
  }

  closeChat() {
    this.chatCollapsed = false;
    this.collapseService.closeChat();
  }
}
