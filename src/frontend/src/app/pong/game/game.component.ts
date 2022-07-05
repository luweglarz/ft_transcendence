import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Game } from '../class/game';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  constructor(
    private gameService: GameService,
    private socket: Socket,
    public game: Game,
  ) {}

  /** Get the #gameCanvas reference with ViewChild decorator. */
  @ViewChild('gameCanvas')
  private gameCanvas!: ElementRef;
  private gameContext: any;

  /** Lifecycle hook called after component's view has been initialized. */
  ngAfterViewInit() {
    this.gameContext = this.gameCanvas.nativeElement.getContext('2d');
    this.gameCanvas.nativeElement.width = this.game.canvaWidth;
    this.gameCanvas.nativeElement.height = this.game.canvaHeight;
    this.socket.on('gameUpdate', (pos1: any, pos2: any) => {
      this.game.players[0].x = pos1.x;
      this.game.players[0].y = pos1.y;
      this.game.players[1].x = pos2.x;
      this.game.players[1].y = pos2.y;
    });
    requestAnimationFrame(this.gameLoop);
  }

  private gameLoop = () => {
    this.gameService.clearCanvas(this.gameCanvas, this.gameContext);
    this.gameContext.backgroundColor = this.game.backgroundColor;
    this.gameService.drawPaddle(this.gameContext, this.game.players[0]);
    this.gameService.drawPaddle(this.gameContext, this.game.players[1]);
    this.gameService.drawGameBorders(
      this.gameCanvas,
      this.gameContext,
      this.game,
    );
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
