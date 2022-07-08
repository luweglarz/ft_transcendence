import { Socket } from 'socket.io';
import { GameMap } from './game-map';

export class Player {
  constructor(
    gameMap: GameMap,
    private _socket: Socket,
    playerNb: number,
    private _speed: number,
  ) {
    this._width = Math.round((gameMap.borderWidth * 3) / 100);
    this._height = Math.round((gameMap.borderHeight * 20) / 100);
    if (playerNb === 1) this._x = (gameMap.canvaWidth * 5) / 100;
    else if (playerNb === 2) this._x = gameMap.borderWidth - this._width;
    this._y = gameMap.borderHeight / 2 - this._height / 2;

    this._borderCollisionUp = Math.round((gameMap.borderHeight * 5) / 100);
    this._borderCollisionDown = Math.round(
      gameMap.canvaHeight -
        Math.round((gameMap.borderHeight * 5) / 100) -
        this._height,
    );
  }

  private _x: number;
  private _y: number;
  private _velocity = 0;
  private _width: number;
  private _height: number;
  private _borderCollisionUp: number;
  private _borderCollisionDown: number;
  private _goals = 0;

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

  get velocity(): number {
    return this._velocity;
  }

  set velocity(newVelocity: number) {
    this._velocity = newVelocity;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(newSpeed: number) {
    this._speed = newSpeed;
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

  get goals(): number {
    return this._goals;
  }

  set goals(goal: number) {
    this._goals = goal;
  }

  checkBorderCollision(): boolean {
    if (this.velocity == -1 && this.y <= this._borderCollisionUp) {
      this.y = this._borderCollisionUp;
      return true;
    } else if (this.velocity == 1 && this.y >= this._borderCollisionDown) {
      this.y = this._borderCollisionDown;
      return true;
    }
    return false;
  }
}
