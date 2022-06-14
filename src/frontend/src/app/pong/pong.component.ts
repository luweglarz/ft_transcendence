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
    this.pongService.requestCreateCustomGame();
  }

  buttonRequestJoinGame(roomId: number){
    this.pongService.requestJoinGameRoom(roomId);
  }
}

