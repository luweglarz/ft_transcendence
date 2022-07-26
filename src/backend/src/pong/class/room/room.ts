import { Ball } from '../ball/ball';
import { GameMap } from '../game-map/game-map';
import { Player } from '../player/player';

export class Room {
  constructor(
    private _uuid: string,
    private _gameMap: GameMap,
    private _players: Player[],
    private _ball: Ball,
  ) {
    this.players[0].socket.join(this.uuid);
    this.players[1].socket.join(this.uuid);
  }

  private _gameLoopInterval: any;

  get uuid(): string {
    return this._uuid;
  }

  get gameMap(): GameMap {
    return this._gameMap;
  }

  get players(): Player[] {
    return this._players;
  }
  get ball(): Ball {
    return this._ball;
  }

  get gameLoopInterval(): any {
    return this._gameLoopInterval;
  }
  set gameLoopInterval(newInterval: any) {
    this._gameLoopInterval = newInterval;
  }
}
