import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { GameMode } from 'src/pong/interface/game-mode.interface';

export class Player {
  constructor(
    gameMode: GameMode,
    private _socket: Socket,
    playerNb: number,
    private _speed: number,
    private _color: string,
  ) {
    this._width = Math.round((gameMode.canvaWidth * 2) / 100);
    this._height = Math.round((gameMode.canvaHeight * 20) / 100);
    this._initialSpped = _speed;

    if (playerNb === 1) this._x = (gameMode.canvaWidth * 2) / 100;
    else if (playerNb === 2)
      this._x =
        gameMode.canvaWidth - this._width - (gameMode.canvaWidth * 2) / 100;
    this._y = gameMode.canvaHeight / 2 - this._height / 2;

    this._borderCollisionUp = Math.round((gameMode.canvaHeight * 2) / 100);
    this._borderCollisionDown = Math.round(
      gameMode.canvaHeight -
        Math.round((gameMode.canvaHeight * 2) / 100) -
        this._height,
    );
    const jwtService = new JwtService();
    this._username = JSON.parse(
      JSON.stringify(jwtService.decode(this._socket.handshake.auth.token)),
    ).username;
  }

  private _x: number;
  private _y: number;
  private _velocity = 0;
  private _goals = 0;
  private _width: number;
  private _height: number;
  private _borderCollisionUp: number;
  private _borderCollisionDown: number;
  private _username: string;

  private _initialSpped: number;
  private _boostCd = 0;

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

  get goals(): number {
    return this._goals;
  }

  set goals(goal: number) {
    this._goals = goal;
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

  set height(newHeight: number) {
    this._height = newHeight;
  }

  get width(): number {
    return this._width;
  }

  set width(newWidth: number) {
    this._width = newWidth;
  }

  get socket(): Socket {
    return this._socket;
  }

  get color(): string {
    return this._color;
  }

  get username(): string {
    return this._username;
  }

  set borderCollisionUp(newBorderCollisionUp: number) {
    this._borderCollisionUp = newBorderCollisionUp;
  }

  set borderCollisionDown(newBorderCollisionDown: number) {
    this._borderCollisionDown = newBorderCollisionDown;
  }

  get initialSpeed(): number {
    return this._initialSpped;
  }

  get boostCd(): number {
    return this._boostCd;
  }

  set boostCd(newCd: number) {
    this._boostCd = newCd;
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
