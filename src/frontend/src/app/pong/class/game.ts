import { Injectable } from '@angular/core';
import { Ball } from './ball';
import { Player } from './player';

@Injectable({
  providedIn: 'root',
})
export class Game {
  private _canvaHeight = 0;
  private _canvaWidth = 0;
  private _backgroundColor = '';
  private _players: Player[] = [new Player(), new Player()];
  private _ball: Ball = new Ball();

  get canvaHeight(): number {
    return this._canvaHeight;
  }

  set canvaHeight(newHeight: number) {
    this._canvaHeight = newHeight;
  }

  get canvaWidth(): number {
    return this._canvaWidth;
  }

  set canvaWidth(newWidth: number) {
    this._canvaWidth = newWidth;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  set backgroundColor(newColor: string) {
    this._backgroundColor = newColor;
  }

  set players(newPlayers: Player[]) {
    this._players = newPlayers;
  }

  get players(): Player[] {
    return this._players;
  }

  get ball(): Ball {
    return this._ball;
  }

  set ball(newBall: Ball) {
    this._ball = newBall;
  }
}
