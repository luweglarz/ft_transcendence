import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(private matchmakingService: GameService, private socket: Socket) {
    //Todo
  }

  //Get the element ref of the game canvas
  @ViewChild('gameCanvas')
  private gameCanvas!: ElementRef;

  private context: any;

  ngOnInit(): void {}

  ngAfterViewInit() {
    //Get an object to draw on the canvas
    this.context = this.gameCanvas.nativeElement.getContext('2d');
    this.socket.on('racketPosition', (pos1: any, pos2: any) => {
      this.context.clearRect(
        0,
        0,
        this.gameCanvas.nativeElement.width,
        this.gameCanvas.nativeElement.height,
      );
      this.context.fillRect(pos1.x, pos1.y, 35, 110);
      this.context.fillRect(pos2.x, pos2.y, 35, 110);
    });
  }
}
