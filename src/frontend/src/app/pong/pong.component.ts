import { Component, OnInit } from '@angular/core';
import { PongService } from './pong.service';

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
})
export class PongComponent implements OnInit {

  constructor(private pongService: PongService) { }

  ngOnInit(): void {
  }

  buttonRequestCreateCustomGame(){
    //Be able to have custom name room
    this.pongService.requestCreateCustomGame("noname");
  }

  buttonRequestJoinGame(roomName: string){
    this.pongService.requestJoinGameRoom(roomName);
  }
}

