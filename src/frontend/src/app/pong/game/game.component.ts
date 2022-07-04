import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Game } from '../class/game';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(
    private gameService: GameService,
    private socket: Socket,
    public game: Game,
  ) {}

  //Get the element ref of the game canvas
  @ViewChild('gameCanvas')
  private _gameCanvas!: ElementRef;
  private _context: any;

  ngOnInit(): void {
    //Todo
  }

  ngAfterViewInit() {
    this._context = this._gameCanvas.nativeElement.getContext('2d');
    this._gameCanvas.nativeElement.width = this.game.canvaWidth;
    this._gameCanvas.nativeElement.height = this.game.canvaHeight;
    this.socket.on('gameUpdate', (pos1: any, pos2: any) => {
      this.game.players[0].x = pos1.x;
      this.game.players[0].y = pos1.y;
      this.game.players[1].x = pos2.x;
      this.game.players[1].y = pos2.y;
    });
    requestAnimationFrame(this.gameLoop);
  }

  private gameLoop = () => {
    this._context.clearRect(
      0,
      0,
      this._gameCanvas.nativeElement.width,
      this._gameCanvas.nativeElement.height,
    );

    this._context.fillRect(
      this.game.players[0].x,
      this.game.players[0].y,
      this.game.players[0].width,
      this.game.players[0].height,
    );
    this._context.fillRect(
      this.game.players[1].x,
      this.game.players[1].y,
      this.game.players[1].width,
      this.game.players[1].height,
    );
    this._context.backgroundColor = this.game.backgroundColor;

    this._context.strokeStyle = this.game.borderColor;
    this._context.lineWidth = 5;
    this._context.strokeRect(
      Math.round((this.game.canvaWidth * 5) / 100 / 2),
      Math.round((this.game.canvaHeight * 5) / 100 / 2),
      this.game.borderWidth,
      this.game.borderHeight,
    );
    this._context.moveTo(
      Math.round(this.game.borderWidth / 2),
      Math.round((this.game.canvaHeight * 5) / 100 / 2),
    );
    this._context.lineTo(
      Math.round(this.game.borderWidth / 2),
      Math.round(this.game.borderHeight + this._context.lineWidth * 2 + 1),
    );
    this._context.strokeStyle = this.game.borderColor;
    this._context.stroke();

    requestAnimationFrame(this.gameLoop);
  };

  @HostListener('document:keydown', ['$event'])
  movement(event: KeyboardEvent) {
    this.gameService.movePaddle(event);
  }

  buttonRequestLeaveNormalGame() {
    this.gameService.requestLeaveNormalGame();
  }
}
