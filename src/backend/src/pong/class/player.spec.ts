import { Socket } from 'socket.io';
import { GameMap } from './game-map';
import { Player } from './player';

describe('Player', () => {
  it('should be defined', () => {
    let socket: Socket;
    const gameMap: GameMap = new GameMap(525, 850, 'black');
    expect(new Player(gameMap, socket, 1, 5, 'white')).toBeDefined();
  });
});
