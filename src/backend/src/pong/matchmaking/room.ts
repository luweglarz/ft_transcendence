import { Socket } from 'socket.io';

export class Room {
  //should be a pair of <userModel, socket> instead of Socket
  constructor(private _players: Socket[], private _uuid: string) {}

  get uuid(): string {
    return this._uuid;
  }

  set players(newPlayers: Socket[]) {
    this._players = newPlayers;
  }

  get players(): Socket[] {
    return this._players;
  }
}
