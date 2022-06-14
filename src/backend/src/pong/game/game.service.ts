import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
    createGameRoom(client: Socket): number{
        var newRoomId = ( Math.random() * 100000 ) | 0;

        client.emit('newGameCreated', {roomId: newRoomId, mySocketId: client.id});

        client.join(newRoomId.toString());
        return newRoomId;
    }

    removeGameRoom(roomId: number, rooms: number[]){
        rooms.splice(rooms.findIndex(element => element == roomId));
    }

}
