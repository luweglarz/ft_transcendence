import { GameMode } from '../../interface/game-mode.interface';
import { Player } from '../player/player';

export class Room {
  constructor(
    private _uuid: string,
    private _gameMode: GameMode,
    private _players: Player[],
  ) {
    this.players[0].socket.join(this.uuid);
    this.players[1].socket.join(this.uuid);
  }

  private _gameLoopInterval: any;

  get uuid(): string {
    return this._uuid;
  }

  get gameMode(): GameMode {
    return this._gameMode;
  }

  get players(): Player[] {
    return this._players;
  }

  get gameLoopInterval(): any {
    return this._gameLoopInterval;
  }
  set gameLoopInterval(newInterval: any) {
    this._gameLoopInterval = newInterval;
  }
}
