import { ElementRef, Injectable } from '@angular/core';
import { CustomGame } from '../class/game-mode/custom-game';
import { GameSocket } from '../class/game-socket';
import { Player } from '../class/player';
import { GameMode } from '../interface/game-mode';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private _socket: GameSocket) {
    this.isInGame = false;
    this.keyPressed = '';
  }

  public isInGame: boolean;
  public keyPressed: string;
  public keyEventsInterval: any;

  get socket(): GameSocket {
    return this._socket;
  }

  isCustomGame(game: GameMode): boolean {
    return game instanceof CustomGame ? true : false;
  }

  requestLeaveGame() {
    this.isInGame = false;
    this.socket.emit('leaveGame');
  }

  sendKeyEvents() {
    this.keyEventsInterval = setInterval(() => {
      this.socket.emit('move', this.keyPressed);
    }, 25);
  }

  drawPlayersInfos(
    playerOneInfo: ElementRef,
    playerTwoInfo: ElementRef,
    players: Player[],
  ) {
    playerOneInfo.nativeElement.innerHTML += players[0].username;
    playerTwoInfo.nativeElement.innerHTML += players[1].username;
  }
}
