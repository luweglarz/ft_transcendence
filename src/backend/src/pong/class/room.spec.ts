import { Room } from './room';
import { v4 as uuidv4 } from 'uuid';
import { Player } from './player';

describe('Room', () => {
  it('should be defined', () => {
    let player1: Player;
    let player2: Player;
    const sockets: Player[] = [player1, player2];
    const roomUuid: string = uuidv4();
    const room: Room = new Room(sockets, roomUuid);
    expect(room).toBeDefined();
  });
});
