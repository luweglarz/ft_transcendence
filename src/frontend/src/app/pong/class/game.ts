import { Injectable } from '@angular/core';
import { Player } from './player';

@Injectable({
  providedIn: 'root',
})
export class Game {
  private _canvaHeight = 0;
  private _canvaWidth = 0;
  private _borderHeight = 0;
  private _borderWidth = 0;
  private _borderColor = '';
  private _players: Player[] = [new Player(), new Player()];
  private _backgroundColor = '';

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

  get borderHeight(): number {
    return this._borderHeight;
  }

  set borderHeight(newHeight: number) {
    this._borderHeight = newHeight;
  }

  get borderWidth(): number {
    return this._borderWidth;
  }

  set borderWidth(newWidth: number) {
    this._borderWidth = newWidth;
  }

  set borderColor(newColor: string) {
    this._borderColor = newColor;
  }

  get borderColor(): string {
    return this._borderColor;
  }

  set players(newPlayers: Player[]) {
    this._players = newPlayers;
  }

  get players(): Player[] {
    return this._players;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  set backgroundColor(newColor: string) {
    this._backgroundColor = newColor;
  }
}
