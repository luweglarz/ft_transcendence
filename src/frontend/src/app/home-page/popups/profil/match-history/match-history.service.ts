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

  nbWins: number = 0;
  nbLoses: number = 0;
  nbGames: number = 0;
  gameHistory: Array<Game> = [];

  constructor(private http: HttpClient, private jwtService: JwtService) {
    this.generateUserHistory('ugtheven');
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

  //GENERATE HISTORY
  retrieveWonGames(username: string) {
    this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=' + username).subscribe(data => {
      this.nbWins = data.wins.length;
      this.nbGames += this.nbWins;
      for (let i = 0; i < this.nbWins; i++){
        this.gameHistory.push(data.wins[i])
      }
    }, error => {
      console.log('ERROR: getting wins');
    })
  }

  retrieveLostGames(username: string) {
    this.http.get<LoseHistory>('http://localhost:3000/game/loses\?username\=' + username).subscribe(data => {
      this.nbLoses = data.loses.length;
      this.nbGames += this.nbLoses;
      for (let i = 0; i < this.nbLoses; i++){
        this.gameHistory.push(data.loses[i])
      }
    }, error => {
      console.log('ERROR: getting loses');
    })
  }

  generateUserHistory(username: string) {
    this.retrieveWonGames(username);
    this.retrieveLostGames(username);
  }

  //UPDATE HISTORY
  updateWinHistory(username: string) {
    this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=' + username).subscribe(data => {
      var tmp: Array<Game> = [];
      for (let i = 0; i < data.wins.length; i++){
        tmp.push(data.wins[i])
      }
      console.log(tmp.filter((game) => game.id > this.nbGames));
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
      console.log(tmp.filter((game) => game.id > this.nbGames));
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
  }

  testButton() {
    console.log('Username: ', this.jwtService.getPayload()?.username);
    console.log('Nombre de parties: ', this.nbGames);
    console.log('Nombre de victoires: ', this.nbWins);
    console.log('Nombre de defaites: ', this.nbLoses);
    console.log(this.gameHistory);

    this.updateUserHistory('ugtheven');
  }
}
