import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
    public game: Game,
  ) {}

  ngOnInit() {
    this.socket.on('gameFinished', (winner: any, leaver?: any) => {
      clearInterval(this.gameService.keyEventsInterval);
      this.gameService.isInGame = false;
      if (leaver != null) console.log(`player ${leaver} has left the game`);
      console.log(winner + ' Won the game');
      this.router.navigate(['/']);
    });
  }

  /** Get the #gameCanvas reference with ViewChild decorator. */
  @ViewChild('gameCanvas')
  private gameCanvas!: ElementRef;
  private gameContext: any;

  /** Lifecycle hook called after component's view has been initialized. */
  ngAfterViewInit() {
    this.gameContext = this.gameCanvas.nativeElement.getContext('2d');
    this.gameCanvas.nativeElement.width = this.game.canvaWidth;
    this.gameCanvas.nativeElement.height = this.game.canvaHeight;
    this.socket.on(
      'gameUpdate',
      (player1Pos: any, player2Pos: any, ballPos: any, score: any) => {
        this.game.players[0].x = player1Pos.x;
        this.game.players[0].y = player1Pos.y;
        this.game.players[1].x = player2Pos.x;
        this.game.players[1].y = player2Pos.y;
        this.game.ball.x = ballPos.x;
        this.game.ball.y = ballPos.y;
        this.game.players[0].goals = score.playerOneGoals;
        this.game.players[1].goals = score.playerTwoGoals;
      },
    );
    requestAnimationFrame(this.gameLoop);
  }

  private gameLoop = () => {
    this.gameService.clearCanvas(this.gameCanvas, this.gameContext);
    this.gameService.fillBackground(this.gameContext, this.game);
    this.gameService.drawMiddleline(this.gameContext, this.game);
    this.gameService.drawPaddle(this.gameContext, this.game.players[0]);
    this.gameService.drawPaddle(this.gameContext, this.game.players[1]);
    this.gameService.drawBall(this.gameContext, this.game.ball);
    this.gameService.drawScore(this.gameContext, this.game);
    requestAnimationFrame(this.gameLoop);
  };

  @HostListener('document:keydown', ['$event'])
  movement(event: KeyboardEvent) {
    this.gameService.keyPressed = event.key;
  }

  @HostListener('document:keyup', ['$event'])
  movementUp(event: KeyboardEvent) {
    if (event.key == this.gameService.keyPressed)
      this.gameService.keyPressed = 'stop';
  }

  buttonRequestLeaveNormalGame() {
    this.gameService.requestLeaveNormalGame();
  }
}
