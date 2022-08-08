import { Ball } from '../ball';
import { Player } from '../player';
import { NormalGame } from './normal-game';

describe('Game', () => {
  it('should create an instance', () => {
    expect(
      new NormalGame(
        0,
        0,
        '',
        [new Player(0, 0, '', ''), new Player(0, 0, '', '')],
        new Ball(0, ''),
      ),
    ).toBeTruthy();
  });
});
