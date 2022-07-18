import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GameComponent } from '../game/game.component';
import { GameService } from '../game/game.service';

@Injectable({
  providedIn: 'root',
})
export class MatchmakingService {
  constructor(
    private socket: Socket,
    private router: Router,
    private gameComponent: GameComponent,
    private gameService: GameService,
  ) {
    this.socket.on('matchmakingLeft', (msg: any) => {
      console.log(msg);
    });
    this.socket.on('error', (msg: string) => {
      console.log(msg);
    });
  }

  requestJoinNormalMatchMaking() {
    this.socket.emit('joinNormalMatchmaking');
    this.socket.once('waitingForAMatch', (msg: any) => {
      console.log(msg);
    });
    this.socket.once(
      'matchFound',
      (msg: any, gameMapInfo: any, playersInfo: any) => {
        this.gameComponent.game.players[0].height = playersInfo.height;
        this.gameComponent.game.players[0].width = playersInfo.width;
        this.gameComponent.game.players[1].height = playersInfo.height;
        this.gameComponent.game.players[1].width = playersInfo.width;
        this.gameComponent.game.players[0].color = playersInfo.playerOneColor;
        this.gameComponent.game.players[1].color = playersInfo.playerTwoColor;
        this.gameComponent.game.ball.color = gameMapInfo.ballColor;
        this.gameComponent.game.canvaHeight = gameMapInfo.canvaHeight;
        this.gameComponent.game.canvaWidth = gameMapInfo.canvaWidth;
        this.gameComponent.game.backgroundColor = gameMapInfo.backgroundColor;
        this.gameService.isInGame = true;
        this.gameComponent.game.ball.radius = gameMapInfo.ballRadius;
        this.router.navigate(['game']);
        console.log(msg);
      },
    );
  }

  requestLeaveNormalMatchMaking() {
    this.socket.emit('leaveNormalMatchmaking');
  }
}
