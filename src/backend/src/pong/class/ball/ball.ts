import { GameMap } from '../game-map/game-map';
import { Player } from '../player/player';

export class Ball {
  constructor(
    gameMap: GameMap,
    private _speed: number,
    private _color: string,
    private _radius: number,
  ) {
    this._initialSpeed = this._speed;

    this._mapCenter.x = Math.round(gameMap.canvaWidth / 2);
    this._mapCenter.y = Math.round(gameMap.canvaHeight / 2);

    this._x = this._mapCenter.x;
    this._y = this._mapCenter.y;

    this._borderCollisionUp = 0;
    this._borderCollisionDown = gameMap.canvaHeight;
  }

  private _x: number;
  private _y: number;
  private _xVelocity = 0;
  private _yVelocity = 0;
  private _borderCollisionUp: number;
  private _borderCollisionDown: number;
  private _mapCenter = {
    x: 0,
    y: 0,
  };
  private _initialSpeed;

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

  get radius(): number {
    return this._radius;
  }

  set radius(newRadius: number) {
    this._radius = newRadius;
  }

  get xVelocity(): number {
    return this._xVelocity;
  }

  set xVelocity(newVelocity: number) {
    this._xVelocity = newVelocity;
  }

  get yVelocity(): number {
    return this._yVelocity;
  }

  set yVelocity(newVelocity: number) {
    this._yVelocity = newVelocity;
  }

  set speed(newSpeed: number) {
    this._speed = newSpeed;
  }

  get speed(): number {
    return this._speed;
  }

  get color(): string {
    return this._color;
  }

  checkBorderCollision(): boolean {
    if (this.yVelocity == -1 && this.y - this.radius <= this._borderCollisionUp)
      return true;
    else if (
      this.yVelocity == 1 &&
      this.y + this.radius >= this._borderCollisionDown
    )
      return true;
    return false;
  }

  checkPaddleCollision(players: Player[]): boolean {
    if (
      this.xVelocity == -1 &&
      this.x - this.radius <= players[0].x + players[0].width &&
      this.x - this.radius >= players[0].x
    )
      if (this.y >= players[0].y && this.y <= players[0].y + players[0].height)
        return true;
    if (
      this.xVelocity == 1 &&
      this.x + this.radius >= players[1].x &&
      this.x + this.radius <= players[1].x + players[1].width
    )
      if (this.y >= players[1].y && this.y <= players[1].y + players[1].height)
        return true;
  }

  resetBall(gameMap: GameMap) {
    this.x = this._mapCenter.x;
    this.y = Math.floor(Math.random() * gameMap.canvaHeight + 1);
    this.speed = this._initialSpeed;
  }
}
