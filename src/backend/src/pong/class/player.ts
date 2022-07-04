import { Socket } from 'socket.io';
import { GameMap } from './game-map';

export class Player {
  constructor(gameMap: GameMap, private _socket: Socket, playerNb: number) {
    this._width = Math.round((gameMap.borderWidth * 3) / 100);
    this._height = Math.round((gameMap.borderHeight * 20) / 100);
    if (playerNb === 1) this._x = (gameMap.canvaWidth * 5) / 100;
    else if (playerNb === 2) this._x = gameMap.borderWidth - this._width;
    this._y = gameMap.borderHeight / 2 - this._height / 2;
  }

  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  get x(): number {
    return this._x;
  }

  set x(newX: number) {
    this._x = newX;
  }

  get y(): number {
    return this._y;
  }

  set y(newY: number) {
    this._y = newY;
  }

  get height(): number {
    return this._height;
  }

  get width(): number {
    return this._width;
  }

  get socket(): Socket {
    return this._socket;
  }
}
