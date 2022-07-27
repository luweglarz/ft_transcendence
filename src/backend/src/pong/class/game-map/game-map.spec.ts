import { GameMap } from './game-map';

describe('GameMap', () => {
  it('should be defined', () => {
    expect(new GameMap(525, 950, 'black')).toBeDefined();
  });
});
