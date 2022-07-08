export class GameMap {
  constructor(
    private _canvaHeight: number,
    private _canvaWidth: number,
    private _backgroundColor: string,
  ) {}

  get canvaWidth(): number {
    return this._canvaWidth;
  }

  get canvaHeight(): number {
    return this._canvaHeight;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }
}
