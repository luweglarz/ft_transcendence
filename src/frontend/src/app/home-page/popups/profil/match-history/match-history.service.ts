import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

 interface Game {
   id: number;
   createdAt: string;
   winnerId: number;
   winnerGoals: number;
   loserId: number;
   loserGoals: number;
 }

 interface WinHistory {
    wins: Array<Game>;
    nbWins: number;
 }

 interface LoseHistory {
  loses: Array<Game>;
  nbWins: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchHistoryService {

  nbWins = 0;
  nbLoses = 0;

  gameHistory: Array<Game> = [];
  nbGames = 0;

  constructor(private http: HttpClient) {
  }

  generateHistory() {

  }

  testButton() {
    //WINS
    this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=ugtheven').subscribe(data => {
      this.nbWins = data.wins.length;
      for (let i = 0; i < this.nbWins; i++){
        this.gameHistory.push(data.wins[i])
      }
    })
    //LOSES
    this.http.get<LoseHistory>('http://localhost:3000/game/loses\?username\=ugtheven').subscribe(data => {
      this.nbLoses = data.loses.length;
      for (let i = 0; i < this.nbLoses; i++){
        this.gameHistory.push(data.loses[i])
      }
    })
    this.nbGames = this.gameHistory.length;
    //OUTPUT
    console.log('Nombre de parties: ', this.nbGames);
    console.log('Nombre de victoires: ', this.nbWins);
    console.log('Nombre de defaites: ', this.nbLoses);
    console.log(this.gameHistory);
  }
}
