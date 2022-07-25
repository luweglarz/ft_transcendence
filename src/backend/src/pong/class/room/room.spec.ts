import { Room } from './room';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../player/player';
import { GameMap } from '../game-map/game-map';

describe('Room', () => {
  it('should be defined', () => {
    let player1: Player;
    let player2: Player;
    const players: Player[] = [player1, player2];
    const roomUuid: string = uuidv4();
    const gameMap: GameMap = new GameMap(525, 850, 'black');
    const room: Room = new Room(players, roomUuid, gameMap);
    expect(room).toBeDefined();
  });
});
