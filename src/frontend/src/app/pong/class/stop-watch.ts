export class StopWatch {
  private _secInQueue = 0;
  private _running = false;
  private _timer: any;

  startTimer() {
    this._timer = setInterval(() => {
      this._secInQueue++;
    }, 1000);
    this._running = true;
  }

  clearTimer() {
    this._running = false;
    this._secInQueue = 0;
    clearInterval(this._timer);
  }

  get running(): boolean {
    return this._running;
  }

  get secInQueue(): number {
    return this._secInQueue;
  }
}
