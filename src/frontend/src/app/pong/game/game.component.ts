import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(private gameService: GameService, private socket: Socket) {
    //Todo
  }

  //Get the element ref of the game canvas
  @ViewChild('gameCanvas')
  private gameCanvas!: ElementRef;
  private playerNb!: number;
  private context: any;

  player1Pos = {
    x:0,
    y:0,
  }

  player2Pos = {
    x:0,
    y:0,
  }

  ngOnInit(): void {
    //Todo
  }

  ngAfterViewInit() {
    //Get an object to draw on the canvas
    this.context = this.gameCanvas.nativeElement.getContext('2d');
    this.socket.on('gameUpdate', (pos1: any, pos2: any) => {
      this.player1Pos.x = pos1.x;
      this.player1Pos.y = pos1.y;
      this.player2Pos.x = pos2.x;
      this.player2Pos.y = pos2.y;
    });
    requestAnimationFrame(this.gameLoop);
  }

  private gameLoop = () => {
    this.context.clearRect(
      0,
      0,
      this.gameCanvas.nativeElement.width,
      this.gameCanvas.nativeElement.height,
    );
    this.context.fillRect(this.player1Pos.x, this.player1Pos.y, 35, 110);
    this.context.fillRect(this.player2Pos.x, this.player2Pos.y, 35, 110);
    this.context.strokeStyle = "black";
    this.context.lineWidth = 5;
    this.context.strokeRect(10,10, this.gameCanvas.nativeElement.width - 20, this.gameCanvas.nativeElement.height - 20);
    this.context.moveTo(425, 515)
    this.context.lineTo(425, 10);
    this.context.strokeStyle = "black";
    this.context.stroke();
    requestAnimationFrame(this.gameLoop);
  }

  @HostListener('document:keydown', ['$event'])
  movement(event: KeyboardEvent) {
    this.gameService.movePaddle(event);
  }

  buttonRequestLeaveNormalGame() {
    this.gameService.requestLeaveNormalGame();
  }
}
