import { GameMap } from '../game-map/game-map';
import { Ball } from './ball';

describe('Ball', () => {
  it('should be defined', () => {
    const gameMap: GameMap = new GameMap(525, 850, 'black');

    expect(new Ball(gameMap, 5, 'white', 5)).toBeDefined();
  });
});
