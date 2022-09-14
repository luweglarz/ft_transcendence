import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { NotificationService } from 'src/app/home-page/services/notification.service';
import { environment } from 'src/environments/environment';
import { GameService } from '../game/game.service';
import { MatchmakingService } from '../matchmaking/matchmaking.service';
import { Ball } from './ball';
import { CustomGame } from './game-mode/custom-game';
import { NormalGame } from './game-mode/normal-game';
import { Player } from './player';
import { StopWatch } from './stop-watch';

@Injectable({
  providedIn: 'root',
})
export class GameSocket extends Socket {
  constructor() {
    super({
      url: environment.backend,
      options: {
        autoConnect: false,
        path: environment.socketGamePath,
        transports: ['websocket', 'polling'],
      },
    });
  }

  onMatchFound(
    notificationService: NotificationService,
    gameService: GameService,
    matchmakingService: MatchmakingService,
    stopWatch: StopWatch,
  ) {
    this.once(
      'matchFound',
      (msg: any, gameType: string, gameMapInfo: any, playersInfo: any) => {
        matchmakingService.requestLeaveMatchmaking();
        notificationService.gameFound();
        stopWatch.clearTimer();
        const playerOne: Player = new Player(
          playersInfo.height,
          playersInfo.width,
          playersInfo.playerOneColor,
          playersInfo.playerOneUsername,
        );
        const playerTwo: Player = new Player(
          playersInfo.height,
          playersInfo.width,
          playersInfo.playerTwoColor,
          playersInfo.playerTwoUsername,
        );
        const ball: Ball = new Ball(
          gameMapInfo.ballRadius,
          gameMapInfo.ballColor,
        );
        gameService.isInGame.next(true);
        console.log(msg);
        if (gameType === 'normal' || gameType === 'ranked') {
          matchmakingService.game = new NormalGame(
            gameMapInfo.canvaHeight,
            gameMapInfo.canvaWidth,
            gameMapInfo.backgroundColor,
            [playerOne, playerTwo],
            ball,
            gameService,
          );
        } else if (gameType === 'custom') {
          matchmakingService.game = new CustomGame(
            gameMapInfo.canvaHeight,
            gameMapInfo.canvaWidth,
            gameMapInfo.backgroundColor,
            [playerOne, playerTwo],
            ball,
            gameService,
          );
        }
      },
    );
  }

  onMatchmakingLeft() {
    this.once('matchmakingLeft', (msg: any) => {
      console.log(msg);
    });
  }

  onWaitingForAMatch(stopWatch: StopWatch) {
    this.once('waitingForAMatch', (msg: any) => {
      stopWatch.startTimer();
      console.log(msg);
    });
  }

  onGameFinished(gameService: GameService) {
    this.once('gameFinished', (winner: any, leaver?: any) => {
      clearInterval(gameService.keyEventsInterval);
      gameService.isInGame.next(false);
      if (leaver != null && leaver != undefined)
        console.log(`Player ${leaver.username} has left the game`);
      console.log(winner.username + ' Has won the game');
    });
  }

  onSpectatedGame(
    gameService: GameService,
    matchmakingService: MatchmakingService,
  ) {
    this.once(
      'spectatedGame',
      (msg: any, gameType: string, gameMapInfo: any, playersInfo: any) => {
        console.log(msg);
        const playerOne: Player = new Player(
          playersInfo.height,
          playersInfo.width,
          playersInfo.playerOneColor,
          playersInfo.playerOneUsername,
        );
        const playerTwo: Player = new Player(
          playersInfo.height,
          playersInfo.width,
          playersInfo.playerTwoColor,
          playersInfo.playerTwoUsername,
        );
        const ball: Ball = new Ball(
          gameMapInfo.ballRadius,
          gameMapInfo.ballColor,
        );
        gameService.isInGame.next(true);
        if (gameType === 'normal' || gameType === 'ranked') {
          matchmakingService.game = new NormalGame(
            gameMapInfo.canvaHeight,
            gameMapInfo.canvaWidth,
            gameMapInfo.backgroundColor,
            [playerOne, playerTwo],
            ball,
            gameService,
          );
        } else if (gameType === 'custom') {
          matchmakingService.game = new CustomGame(
            gameMapInfo.canvaHeight,
            gameMapInfo.canvaWidth,
            gameMapInfo.backgroundColor,
            [playerOne, playerTwo],
            ball,
            gameService,
          );
        }
      },
    );
  }
}
