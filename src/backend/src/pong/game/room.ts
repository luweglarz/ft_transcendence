import { Socket } from 'socket.io';

export class Room {
    //should be the user data type instead of Socket
    constructor(private playerArray: Socket[], private newUuid: string) {}

    players: Socket[] = this.playerArray;
    uuid: string = this.newUuid;
}
