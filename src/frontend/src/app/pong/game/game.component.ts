import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { CustomGame } from '../class/game-mode/custom-game';
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
    matchmakingService: MatchmakingService,
  ) {
    this.game = matchmakingService.game;
    console.log('constructor gmae component');
  }

  ngOnInit() {
    this.gameService.sendKeyEvents();
    this.gameService.socket.onGameFinished(this.gameService);
  }

  private game: GameMode;

  private gameContext: any;
  @ViewChild('gameCanvas')
  private gameCanvas!: ElementRef;
  @ViewChild('playersInfo')
  private playersInfo!: ElementRef;
  @ViewChild('playerOneInfo')
  private playerOneInfo!: ElementRef;
  @ViewChild('boostOne')
  private boostOne!: ElementRef;
  @ViewChild('playerTwoInfo')
  private playerTwoInfo!: ElementRef;
  @ViewChild('boostTwo')
  private boostTwo!: ElementRef;

  ngAfterViewInit() {
    this.playersInfo.nativeElement.style.width = this.game.canvaWidth + 'px';
    this.gameService.setBoostContext(this.boostOne, this.boostTwo);
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
    if (this.gameService.isInGame === false) return;
    this.gameService.clearCanvas(this.gameCanvas, this.gameContext);
    this.gameService.fillBackground(this.gameContext, this.game);
    this.gameService.drawMiddleline(this.gameContext, this.game);
    this.gameService.drawPaddle(this.gameContext, this.game.players[0]);
    this.gameService.drawPaddle(this.gameContext, this.game.players[1]);
    this.gameService.drawBall(this.gameContext, this.game.ball);
    this.gameService.drawScore(this.gameContext, this.game);
    if (this.game instanceof CustomGame)
      this.gameService.drawBoost(
        this.game.players,
        this.boostOne,
        this.boostTwo,
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
