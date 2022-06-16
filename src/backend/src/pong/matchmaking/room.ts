import { Socket } from 'socket.io';

export class Room {
  //should be the a pair of <userModel, socket> instead of Socket
  constructor(private playerArray: Socket[], private newUuid: string) {}

  private _uuid: string = this.newUuid;

  get uuid(): string {
    return this._uuid;
  }

  private _players: Socket[] = this.playerArray;

  set players(newPlayers: Socket[]) {
    this._players = newPlayers;
  }

  get players(): Socket[] {
    return this._players;
  }
}
