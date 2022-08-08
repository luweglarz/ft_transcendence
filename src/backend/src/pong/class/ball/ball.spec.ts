import { GameMode } from 'src/pong/interface/game-mode.interface';
import { NormalGame } from '../game-mode/normal-game/normal-game';
import { Ball } from './ball';

describe('Ball', () => {
  it('should be defined', () => {
    const gameMap: GameMode = new NormalGame(525, 850, 'black');

    expect(new Ball(gameMap, 5, 'white', 5)).toBeDefined();
  });
});
