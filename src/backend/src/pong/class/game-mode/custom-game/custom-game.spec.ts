import { CustomGame } from './custom-game';

describe('CustomGame', () => {
  it('should be defined', () => {
    expect(new CustomGame(525, 950, 'black')).toBeDefined();
  });
});
