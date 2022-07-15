export class Ball {
  private _radius = 0;
  private _x = 0;
  private _y = 0;
  private _color = '';

  get radius(): number {
    return this._radius;
  }

  set radius(newRadius: number) {
    this._radius = newRadius;
  }

  get y(): number {
    return this._y;
  }

  set y(newY: number) {
    this._y = newY;
  }

  get x(): number {
    return this._x;
  }

  set x(newX: number) {
    this._x = newX;
  }

  get color(): string {
    return this._color;
  }

  set color(newColor: string) {
    this._color = newColor;
  }
}
