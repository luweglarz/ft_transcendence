import { Socket } from 'socket.io';

export class Player {
  constructor(private _x: number, private _y: number, private _socket: Socket) {
    //Todo
  }

  get x(): number {
    return this._x;
  }

  set x(newPos) {
    this._x = newPos;
  }

  get y(): number {
    return this._y;
  }

  set y(newPos) {
    this._y = newPos;
  }

  get socket(): Socket {
    return this._socket;
  }
}
