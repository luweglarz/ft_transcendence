import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Room } from './room';

@Injectable()
export class GameRoomService {
    createGameRoom(client: Socket, roomName: string): Room{
        client.emit('newGameCreated', {roomId: roomName, mySocketId: client.id});
        client.join(roomName);
        let newRoom: Room = new Room();
        newRoom.slots = new Set<Socket>();
        newRoom.slots.add(client);
        //Will be username of the creator of the room
        newRoom.creator = 'noname'
        newRoom.name = roomName;
        return (newRoom);
    }

    removeGameRoom(roomId: number, rooms: number[]){
        rooms.splice(rooms.findIndex(element => element == roomId), 1);
    }

}
