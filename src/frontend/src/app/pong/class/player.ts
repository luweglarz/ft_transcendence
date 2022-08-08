export class Player {
  constructor(
    private _height: number,
    private _width: number,
    private _color: string,
    private _username: string,
  ) {}
  private _x = 0;
  private _y = 0;
  private _goals = 0;
  private _boostCd = 0;

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

  get goals(): number {
    return this._goals;
  }

  set goals(goal: number) {
    this._goals = goal;
  }

  get color(): string {
    return this._color;
  }

  set color(newColor: string) {
    this._color = newColor;
  }

  get username(): string {
    return this._username;
  }

  set username(newUsername: string) {
    this._username = newUsername;
  }

  get boostCd(): number {
    return this._boostCd;
  }

  set boostCd(newCd: number) {
    this._boostCd = newCd;
  }
}
