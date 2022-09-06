import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { JwtService } from 'src/app/auth/jwt';
import { CustomGame } from '../class/game-mode/custom-game';
import { GameSocket } from '../class/game-socket';
import { GameMode } from '../interface/game-mode';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private _socket: GameSocket, private jwtService: JwtService) {
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
    this.jwtService
      .getToken$()
      .pipe(tap((token) => (this.socket.ioSocket.auth = { token: token })))
      .subscribe(() => this.socket.emit('leaveGame'));
  }

  sendKeyEvents() {
    this.keyEventsInterval = setInterval(() => {
      this.socket.emit('move', this.keyPressed);
    }, 25);
  }
}
