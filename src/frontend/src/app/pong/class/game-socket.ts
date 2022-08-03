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
    this.on('matchmakingLeft', (msg: any) => {
      console.log(msg);
    });
  }

  onWaitingForAmatch(stopWatch: StopWatch) {
    this.on('waitingForAMatch', (msg: any) => {
      stopWatch.startTimer();
      console.log(msg);
    });
  }

  onGameUpdate(gameService: GameService, game: Game) {
    this.on(
      'gameUpdate',
      (player1Pos: any, player2Pos: any, ballPos: any, score: any) => {
        game.players[0].x = player1Pos.x;
        game.players[0].y = player1Pos.y;
        game.players[1].x = player2Pos.x;
        game.players[1].y = player2Pos.y;
        game.ball.x = ballPos.x;
        game.ball.y = ballPos.y;
        game.players[0].goals = score.playerOneGoals;
        game.players[1].goals = score.playerTwoGoals;
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
