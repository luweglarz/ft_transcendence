import { GameMap } from './game-map';
import { Player } from './player';

export class Ball {
  constructor(gameMap: GameMap, private _speed: number) {
    this._mapCenter.x = gameMap.canvaWidth / 2;
    this._mapCenter.y = gameMap.canvaHeight / 2;

    this._x = this._mapCenter.x;
    this._y = this._mapCenter.y;
    this._radius =
      (((gameMap.borderHeight * 2 + gameMap.borderWidth * 2) / 2) * 0.5) / 100;

    this._borderCollisionUp = Math.round((gameMap.borderHeight * 5) / 100);
    this._borderCollisionDown = Math.round(
      gameMap.canvaHeight - Math.round((gameMap.borderHeight * 5) / 100),
    );
  }

  private _x: number;
  private _y: number;
  private _radius: number;
  private _xVelocity = 0;
  private _yVelocity = 0;
  private _borderCollisionUp: number;
  private _borderCollisionDown: number;
  private _mapCenter = {
    x: 0,
    y: 0,
  };

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

  get speed(): number {
    return this._speed;
  }

  checkBorderCollision(): boolean {
    if (this.yVelocity == -1 && this.y <= this._borderCollisionUp) {
      this.y = this._borderCollisionUp;
      return true;
    } else if (this.yVelocity == 1 && this.y >= this._borderCollisionDown) {
      this.y = this._borderCollisionDown;
      return true;
    }
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
  }
}
