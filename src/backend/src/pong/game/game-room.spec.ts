import { Socket } from 'socket.io';
import { Room } from './game-room';
import { v4 as uuidv4 } from 'uuid';

describe('Room', () => {
  it('should be defined', () => {
    let socket1: Socket;
    let socket2: Socket;
    const sockets: Socket[] = [socket1, socket2];
    const roomUuid: string = uuidv4();
    const room: Room = new Room(sockets, roomUuid);
    expect(room).toBeDefined();
  });
});
