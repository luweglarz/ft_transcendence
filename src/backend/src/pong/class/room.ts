import { Player } from './player';

export class Room {
  constructor(private _players: Player[], private _uuid: string) {}

  get uuid(): string {
    return this._uuid;
  }

  set players(newPlayers: Player[]) {
    this._players = newPlayers;
  }

  get players(): Player[] {
    return this._players;
  }
}
