import { Socket } from 'socket.io';
import { Player } from './player';

describe('Player', () => {
  it('should be defined', () => {
    let socket: Socket;
    let x: number;
    let y: number;
    expect(new Player(x, y, socket)).toBeDefined();
  });
});
