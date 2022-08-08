import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { JwtService } from 'src/app/auth/jwt';
import { NotificationService } from 'src/app/home-page/notification.service';
import { environment } from 'src/environments/environment';
import { GameComponent } from '../game/game.component';
import { GameService } from '../game/game.service';
import { Game } from './game';
import { StopWatch } from './stop-watch';

@Injectable({
  providedIn: 'root',
})
export class GameSocket extends Socket {
  constructor(jwtService: JwtService) {
    super({
      url: environment.backend,
      options: { autoConnect: false, path: environment.socketGamePath },
    });
    this.ioSocket.auth = { token: jwtService.getToken() };
  }

  onMatchFound(
    notificationService: NotificationService,
    gameComponent: GameComponent,
    gameService: GameService,
    stopWatch: StopWatch,
  ) {
    this.once('matchFound', (msg: any, gameMapInfo: any, playersInfo: any) => {
      notificationService.gameFound();
      stopWatch.clearTimer();
      gameComponent.game.players[0].height = playersInfo.height;
      gameComponent.game.players[0].width = playersInfo.width;
      gameComponent.game.players[1].height = playersInfo.height;
      gameComponent.game.players[1].width = playersInfo.width;
      gameComponent.game.players[0].color = playersInfo.playerOneColor;
      gameComponent.game.players[1].color = playersInfo.playerTwoColor;
      gameComponent.game.players[0].username = playersInfo.playerOneUsername;
      gameComponent.game.players[1].username = playersInfo.playerTwoUsername;
      gameComponent.game.ball.color = gameMapInfo.ballColor;
      gameComponent.game.canvaHeight = gameMapInfo.canvaHeight;
      gameComponent.game.canvaWidth = gameMapInfo.canvaWidth;
      gameComponent.game.backgroundColor = gameMapInfo.backgroundColor;
      gameService.isInGame = true;
      gameComponent.game.ball.radius = gameMapInfo.ballRadius;
      console.log(msg);
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

  onGameUpdate(game: Game) {
    this.on(
      'gameUpdate',
      (
        player1Pos: any,
        player2Pos: any,
        ballPos: any,
        score: any,
        playerHeights?: any,
        playerWidth?: any,
        playersCd?: any,
      ) => {
        game.players[0].x = player1Pos.x;
        game.players[0].y = player1Pos.y;
        game.players[1].x = player2Pos.x;
        game.players[1].y = player2Pos.y;
        game.ball.x = ballPos.x;
        game.ball.y = ballPos.y;
        game.players[0].goals = score.playerOneGoals;
        game.players[1].goals = score.playerTwoGoals;
        if (playerHeights != undefined && playerWidth != undefined) {
          game.players[0].height = playerHeights.player1Height;
          game.players[1].height = playerHeights.player2Height;
          game.players[0].width = playerWidth.player1Width;
          game.players[1].width = playerWidth.player2Width;
        }
        if (playersCd != undefined) {
          game.players[0].boostCd = playersCd.player1Cd;
          game.players[1].boostCd = playersCd.player2Cd;
        }
      },
    );
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
}
