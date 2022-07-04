import { GameMap } from './game-map';

describe('GameMap', () => {
  it('should be defined', () => {
    expect(new GameMap(525, 850, 'black', 'yellow')).toBeDefined();
  });
});
