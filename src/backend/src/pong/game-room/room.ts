import { Socket } from 'socket.io';

export class Room {
  slots: Set<Socket>;
  creator: string;
  name: string;
}
