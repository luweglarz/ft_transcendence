import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { JwtService } from 'src/app/auth/jwt';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
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
    private matchmakingService: MatchmakingService,
    private jwtService: JwtService,
    private router: Router,
  ) {
    if (!this.gameService.isInGame.getValue())
      this.router.navigate([''], {
        queryParamsHandling: 'preserve',
      });
    this.game = matchmakingService.game;
  }

  ngOnInit() {
    this.gameService.sendKeyEvents();
    this.gameService.socket.onGameFinished(this.gameService);
    this.gameService.isInGame.subscribe((isInGame) => {
      if (!isInGame)
        this.router.navigate([''], {
          queryParamsHandling: 'preserve',
        });
    });
  }

  public game: GameMode;

  private gameContext: any;
  @ViewChild('gameCanvas')
  private gameCanvas!: ElementRef;

  @ViewChild('boostOne')
  private boostOne!: ElementRef;
  @ViewChild('boostTwo')
  private boostTwo!: ElementRef;

  ngAfterViewInit() {
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

  buttonSpectateGame(username: string) {
    this.jwtService
      .getToken$()
      .pipe(
        tap(
          (token) => (this.gameService.socket.ioSocket.auth = { token: token }),
        ),
      )
      .subscribe(() => {
        this.gameService.socket.connect();
        this.gameService.socket.onSpectatedGame(
          this.gameService,
          this.matchmakingService,
        );
        this.gameService.socket.emit('spectateGame', username);
      });
  }
}
