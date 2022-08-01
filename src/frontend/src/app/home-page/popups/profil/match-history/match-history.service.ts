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
  // sortHistory() {
  //   this.gameHistory.sort((n1, n2) => {
  //     if (n1.id > n2.id) {
  //       return 1;
  //     }
  //     if (n1.id < n2.id) {
  //       return -1;
  //     }
  //     return 0;
  //   })
  // }

  //TEST


  //RETRIEVE WIN LOSES COUNTER
  async retrieveWinCounter(username: string){
    return new Promise(resolve => {
      this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=' + username).subscribe(data => {
        resolve (data.wins.length);
      })
    });
  }

  async retrieveLoseCounter(username: string){
    return new Promise(resolve => {
      this.http.get<LoseHistory>('http://localhost:3000/game/loses\?username\=' + username).subscribe(data => {
        resolve (data.loses.length);
      })
    });
  }

  //RETRIEVE USER HISTORY
  async retrieveWonGames(username: string): Promise<Array<Game>> {
    let winHistory: Array<Game> = [];
    return new Promise(resolve => {
      this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=' + username).subscribe(data => {
        data.wins.forEach(val => winHistory.push(Object.assign({}, val)));
        resolve (winHistory);
      })
    });
  }

  async retrieveLostGames(username: string): Promise<Array<Game>> {
    let loseHistory: Array<Game> = [];
    return new Promise(resolve => {
      this.http.get<LoseHistory>('http://localhost:3000/game/loses\?username\=' + username).subscribe(data => {
        data.loses.forEach(val => loseHistory.push(Object.assign({}, val)));
        resolve (loseHistory);
      })
    });
  }

  async retrieveUserHistory(username: string): Promise<Array<Game>> {
    let winHistory: Array<Game> = await this.retrieveWonGames(username);
    let loseHistory: Array<Game> = await this.retrieveLostGames(username);
    let gameHistory: Array<Game> = winHistory.concat(loseHistory);
    return (gameHistory);
  }


  //UPDATE HISTORY
  // updateWinHistory(username: string) {
  //   this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=' + username).subscribe(data => {
  //     var tmp: Array<Game> = [];
  //     for (let i = 0; i < data.wins.length; i++){
  //       tmp.push(data.wins[i])
  //     }
  //     tmp = tmp.filter((game) => game.id > this.nbGames);
  //     this.nbGames += tmp.length;
  //     for (let i = 0; i < tmp.length; i++){
  //       this.gameHistory.push(tmp[i])
  //     }
  //   }, error => {
  //     console.log('ERROR: getting wins');
  //   })
  // }

  // updateLoseHistory(username: string) {
  //   this.http.get<LoseHistory>('http://localhost:3000/game/loses\?username\=' + username).subscribe(data => {
  //     var tmp: Array<Game> = [];
  //     for (let i = 0; i < data.loses.length; i++){
  //       tmp.push(data.loses[i])
  //     }
  //     tmp = tmp.filter((game) => game.id > this.nbGames);
  //     this.nbGames += tmp.length;
  //     for (let i = 0; i < tmp.length; i++){
  //       this.gameHistory.push(tmp[i])
  //     }
  //   }, error => {
  //     console.log('ERROR: getting wins');
  //   })
  // }

  // updateUserHistory(username: string) {
  //   this.updateWinHistory(username);
  //   this.updateLoseHistory(username);
  //   //this.sortHistory();
  // }

  //DEBUG
  testButton() {
    console.log('Username: ', this.jwtService.getPayload()?.username);

    console.log('Nombre de victoires: ', this.retrieveWinCounter('ugtheven'));
    console.log('Nombre de defaites: ', this.retrieveLoseCounter('ugtheven'));

    console.log('Win History', this.retrieveWonGames('ugtheven'));
    console.log('Lose History', this.retrieveLostGames('ugtheven'));
    console.log('Game History', this.retrieveUserHistory('ugtheven'));
    //let gameHistory: Array<Game> = this.retrieveUserHistory('ugtheven');
  }
}
