import { GameMap } from '../game-map/game-map';
import { Player } from '../player/player';

export class Room {
  constructor(
    private _players: Player[],
    private _uuid: string,
    private _gameMap: GameMap,
  ) {}

  get uuid(): string {
    return this._uuid;
  }

  get players(): Player[] {
    return this._players;
  }

  get gameMap(): GameMap {
    return this._gameMap;
  }
}
