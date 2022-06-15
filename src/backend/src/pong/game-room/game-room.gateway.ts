import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameGateway } from '../game/game.gateway';
import { GameRoomService } from './game-room.service';
import { Room } from './room';

@WebSocketGateway()
export class GameRoomGateway {

  constructor(private gameRoomService: GameRoomService, private gameCoreGateway: GameGateway) {}

  private logger: Logger = new Logger('gameRoomGateway');
  rooms: Array<Room> = new Array<Room>();
  
  @SubscribeMessage("createCustomGame")
  createCustomGame(client: Socket, roomName: string){
    let newRoom: Room = this.gameRoomService.createGameRoom(client, roomName);
    this.rooms.push(newRoom);
    this.logger.log("New room has be created: " + newRoom.name);
    this.logger.log("Amount of rooms created so far: " + this.rooms.length);
  }

  @SubscribeMessage("joinGameRoom")
  joinGameRoom(client: Socket, roomName: string){
    // let roomToJoin: Room = (Wrapper of a function to find a the asked room in game-room.service);
    client.join(roomName);
    this.gameCoreGateway.server.to(this.rooms[this.rooms.findIndex(element => element.name === roomName)].name).emit('roomJoined');
    this.logger.log(`Client ${client.id} has joined the room nb `+ this.rooms[this.rooms.findIndex(element => element.name === roomName)].name);
  }

}
