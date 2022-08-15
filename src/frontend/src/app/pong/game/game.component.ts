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
    public gameService: GameService,
    matchmakingService: MatchmakingService,
  ) {
    this.game = matchmakingService.game;
  }

  ngOnInit() {
    this.gameService.sendKeyEvents();
    this.gameService.socket.onGameFinished(this.gameService);
  }

  public game: GameMode;

  private gameContext: any;
  @ViewChild('gameCanvas')
  private gameCanvas!: ElementRef;
  @ViewChild('playersInfo')
  private playersInfo!: ElementRef;
  @ViewChild('playerOneInfo')
  private playerOneInfo!: ElementRef;
  @ViewChild('playerTwoInfo')
  private playerTwoInfo!: ElementRef;

  @ViewChild('boostOne')
  private boostOne!: ElementRef;
  @ViewChild('boostTwo')
  private boostTwo!: ElementRef;

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
    this.game.setDrawUtilities(this.gameContext, this.boostOne, this.boostTwo);
    requestAnimationFrame(this.game.gameLoop);
  }

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
