import { NormalGame } from './normal-game';

describe('NormalGame', () => {
  it('should be defined', () => {
    expect(new NormalGame(525, 950, 'black')).toBeDefined();
  });
});
