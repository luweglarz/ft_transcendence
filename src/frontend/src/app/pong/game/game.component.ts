import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CollapseService } from 'src/app/home-page/collapse.service';
import { GameMode } from '../interface/game-mode';
import { MatchmakingService } from '../matchmaking/matchmaking.service';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(
    public collapseService: CollapseService,
    private gameService: GameService,
    private matchmakingService: MatchmakingService,
  ) {
    this.game = matchmakingService.game;
  }

  ngOnInit() {
    this.gameService.sendKeyEvents();
    this.gameService.socket.onGameFinished(this.gameService);
  }

  private game: GameMode;

  /** Get the #gameCanvas reference with ViewChild decorator. */
  @ViewChild('gameCanvas')
  private gameCanvas!: ElementRef;
  private gameContext: any;

  @ViewChild('playersInfo')
  private playersInfo!: ElementRef;

  @ViewChild('playerOneInfo')
  private playerOneInfo!: ElementRef;

  @ViewChild('playerTwoInfo')
  private playerTwoInfo!: ElementRef;

  /** Lifecycle hook called after component's view has been initialized. */
  ngAfterViewInit() {
    this.playersInfo.nativeElement.style.width = this.game.canvaWidth + 'px';
    this.gameService.drawPlayersInfos(
      this.playerOneInfo,
      this.playerTwoInfo,
      this.game.players,
    );

    this.gameContext = this.gameCanvas.nativeElement.getContext('2d');
    this.gameCanvas.nativeElement.width = this.game.canvaWidth;
    this.gameCanvas.nativeElement.height = this.game.canvaHeight;

    this.game.onGameUpdate(this.gameService.socket);
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
    this.gameService.drawBoost(
      this.playerOneInfo,
      this.playerTwoInfo,
      this.game.players,
    );
    requestAnimationFrame(this.gameLoop);
  };

  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.gameService.keyPressed = event.key;
  }

  @HostListener('document:keyup', ['$event'])
  stopKeyLoop(event: KeyboardEvent) {
    if (event.key == this.gameService.keyPressed)
      this.gameService.keyPressed = 'stop';
  }

  buttonRequestLeaveGame() {
    this.gameService.requestLeaveGame();
  }
}
