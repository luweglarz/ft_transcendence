export class GameMap {
  constructor(
    private _canvaHeight: number,
    private _canvaWidth: number,
    private _backgroundColor: string,
    private _borderColor: string,
  ) {
    this._borderHeight = Math.round(
      this._canvaHeight - (this.canvaHeight * 5) / 100,
    );
    this._borderWidth = Math.round(
      this._canvaWidth - (this.canvaWidth * 5) / 100,
    );
  }

  private _borderHeight: number;
  private _borderWidth: number;

  get canvaWidth(): number {
    return this._canvaWidth;
  }

  get canvaHeight(): number {
    return this._canvaHeight;
  }

  get borderHeight(): number {
    return this._borderHeight;
  }

  get borderWidth(): number {
    return this._borderWidth;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  get borderColor(): string {
    return this._borderColor;
  }
}
