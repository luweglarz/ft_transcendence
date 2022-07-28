import { Injectable } from '@angular/core';
import { AuthSocket } from 'src/app/class/auth-socket';
import { NotificationService } from 'src/app/home-page/notification.service';
import { GameComponent } from '../game/game.component';
import { GameService } from '../game/game.service';

@Injectable({
  providedIn: 'root',
})
export class MatchmakingService {
  constructor(
    private socket: AuthSocket,
    private gameComponent: GameComponent,
    private gameService: GameService,
    public notificationService: NotificationService,
  ) {
    this.socket.on('matchmakingLeft', (msg: any) => {
      console.log(msg);
    });
    this.socket.on('error', (msg: string) => {
      console.log(msg);
    });
  }

  requestJoinNormalMatchMaking() {
    this.socket.emit('joinNormalMatchmaking', 'normal');
    this.socket.once('waitingForAMatch', (msg: any) => {
      console.log(msg);
    });
    this.socket.once(
      'matchFound',
      (msg: any, gameMapInfo: any, playersInfo: any) => {
        this.notificationService.gameFound();

        this.gameComponent.game.players[0].height = playersInfo.height;
        this.gameComponent.game.players[0].width = playersInfo.width;
        this.gameComponent.game.players[1].height = playersInfo.height;
        this.gameComponent.game.players[1].width = playersInfo.width;
        this.gameComponent.game.players[0].color = playersInfo.playerOneColor;
        this.gameComponent.game.players[1].color = playersInfo.playerTwoColor;
        this.gameComponent.game.players[0].username =
          playersInfo.playerOneUsername;
        this.gameComponent.game.players[1].username =
          playersInfo.playerTwoUsername;
        this.gameComponent.game.ball.color = gameMapInfo.ballColor;
        this.gameComponent.game.canvaHeight = gameMapInfo.canvaHeight;
        this.gameComponent.game.canvaWidth = gameMapInfo.canvaWidth;
        this.gameComponent.game.backgroundColor = gameMapInfo.backgroundColor;
        this.gameService.isInGame = true;
        this.gameComponent.game.ball.radius = gameMapInfo.ballRadius;
        console.log(msg);
      },
    );
  }

  requestLeaveMatchMaking() {
    this.socket.emit('leaveMatchmaking');
  }
}
