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
    this.socket.on('normalGameLeft', (msg: any) => {
      console.log(msg);
      this.router.navigate(['matchmaking']);
    });
    this.socket.on('matchmakingLeft', (msg: any) => {
      console.log(msg);
    });
    this.socket.on('error', (msg: string) => {
      console.log(msg);
    });
  }

  requestJoinNormalMatchMaking() {
    this.socket.emit('joinNormalMatchmaking');
    this.socket.on('waitingForAMatch', (msg: any) => {
      console.log(msg);
    });
    this.socket.on(
      'matchFound',
      (msg: any, gameMapInfo: any, playersInfo: any) => {
        this.gameComponent.game.players[0].height = playersInfo.height;
        this.gameComponent.game.players[0].width = playersInfo.width;
        this.gameComponent.game.players[1].height = playersInfo.height;
        this.gameComponent.game.players[1].width = playersInfo.width;
        this.gameComponent.game.canvaHeight = gameMapInfo.canvaHeight;
        this.gameComponent.game.canvaWidth = gameMapInfo.canvaWidth;
        this.gameComponent.game.backgroundColor = gameMapInfo.backgroundColor;
        this.gameComponent.game.borderHeight = gameMapInfo.borderHeight;
        this.gameComponent.game.borderWidth = gameMapInfo.borderWidth;
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