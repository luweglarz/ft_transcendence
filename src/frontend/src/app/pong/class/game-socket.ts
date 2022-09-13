import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { InviteService } from 'src/app/home-page/services/invite.service';
import { NotificationService } from 'src/app/home-page/services/notification.service';
import { WaitService } from 'src/app/home-page/services/wait.service';
import { WaitComponent } from 'src/app/home-page/wait/wait.component';
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
  constructor(public waitService: WaitService) {
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
    this.on(
      'matchFound',
      (msg: any, gameType: string, gameMapInfo: any, playersInfo: any) => {
        notificationService.gameFound();
        this.waitService.closeWait();
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
        gameService.isInGame = true;
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

  oninvitationAccepted(inviteService: InviteService) {
    this.once('invitationAccepted', (friendUsername: string) => {
      inviteService.openInvite(friendUsername);
    });
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
      gameService.isInGame = false;
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
        gameService.isInGame = true;
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
