export class Player {
  private _height = 0;
  private _width = 0;
  private _x = 0;
  private _y = 0;

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
}
