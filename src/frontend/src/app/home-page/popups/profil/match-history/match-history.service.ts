import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';

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
 }

 interface LoseHistory {
  loses: Array<Game>;
}

@Injectable({
  providedIn: 'root'
})
export class MatchHistoryService {

  nbWins: number = 0;
  nbLoses: number = 0;
  nbGames: number = 0;
  gameHistory: Array<Game> = [];

  constructor(private http: HttpClient, private jwtService: JwtService) {
    //this.retrieveUserHistory('ugtheven');
  }

  //UTILS
  sortHistory() {
    this.gameHistory.sort((n1, n2) => {
      if (n1.id > n2.id) {
        return 1;
      }
      if (n1.id < n2.id) {
        return -1;
      }
      return 0;
    })
  }

  //RETRIEVE WIN LOSES COUNTER
  retrieveWinCounter(username: string): number{
    let nbWins: number = -1;
    this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=' + username).subscribe(data => {
      nbWins = data.wins.length;
      return (nbWins);
    })
    return (nbWins);
  }

  retrieveLoseCounter(username: string): number{
    let nbLoses: number = -1;
    this.http.get<LoseHistory>('http://localhost:3000/game/loses\?username\=' + username).subscribe(data => {
      nbLoses = data.loses.length;
      return (nbLoses);
    })
    return (nbLoses);
  }

  //RETRIEVE USER HISTORY
  retrieveWonGames(username: string): Array<Game> {
    let winHistory: Array<Game> = [];
    this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=' + username).subscribe(data => {
      for (let i = 0; i < data.wins.length; i++){
        winHistory.push(data.wins[i])
      }
      return (winHistory);
    })
    return (winHistory);
  }

  retrieveLostGames(username: string): Array<Game> {
    let loseHistory: Array<Game> = [];
    this.http.get<LoseHistory>('http://localhost:3000/game/loses\?username\=' + username).subscribe(data => {
      for (let i = 0; i < data.loses.length; i++){
        loseHistory.push(data.loses[i])
      }
      return (loseHistory);
    })
    return (loseHistory);
  }

  retrieveUserHistory(username: string): Array<Game> {
    let winHistory: Array<Game> = this.retrieveWonGames(username);
    let loseHistory: Array<Game> = this.retrieveLostGames(username);
    let gameHistory: Array<Game> = [...winHistory, ...loseHistory];
    //this.sortHistory();
    return (gameHistory);
  }

  //UPDATE HISTORY
  updateWinHistory(username: string) {
    this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=' + username).subscribe(data => {
      var tmp: Array<Game> = [];
      for (let i = 0; i < data.wins.length; i++){
        tmp.push(data.wins[i])
      }
      tmp = tmp.filter((game) => game.id > this.nbGames);
      this.nbGames += tmp.length;
      for (let i = 0; i < tmp.length; i++){
        this.gameHistory.push(tmp[i])
      }
    }, error => {
      console.log('ERROR: getting wins');
    })
  }

  updateLoseHistory(username: string) {
    this.http.get<LoseHistory>('http://localhost:3000/game/loses\?username\=' + username).subscribe(data => {
      var tmp: Array<Game> = [];
      for (let i = 0; i < data.loses.length; i++){
        tmp.push(data.loses[i])
      }
      tmp = tmp.filter((game) => game.id > this.nbGames);
      this.nbGames += tmp.length;
      for (let i = 0; i < tmp.length; i++){
        this.gameHistory.push(tmp[i])
      }
    }, error => {
      console.log('ERROR: getting wins');
    })
  }


  updateUserHistory(username: string) {
    this.updateWinHistory(username);
    this.updateLoseHistory(username);
    this.sortHistory();
  }



  //DEBUG
  testButton() {
    console.log('Username: ', this.jwtService.getPayload()?.username);
    console.log('Nombre de parties: ', this.nbGames);
    //console.log('Nombre de victoires: ', this.nbWins);
    //console.log('Nombre de defaites: ', this.nbLoses);
    console.log('Nombre de victoires: ', this.retrieveWinCounter('ugtheven'));
    console.log('Nombre de defaites: ', this.retrieveLoseCounter('ugtheven'));
    //this.updateUserHistory('ugtheven');
    console.log('Win History', this.retrieveWonGames('ugtheven'));
    console.log('Loss History', this.retrieveLostGames('ugtheven'));
    //console.log('Game History', this.gameHistory);
    console.log('Game History', this.retrieveUserHistory('ugtheven'));
  }
}
