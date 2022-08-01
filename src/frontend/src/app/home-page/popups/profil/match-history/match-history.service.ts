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

  constructor(private http: HttpClient, private jwtService: JwtService) {
  }

  //RETRIEVE WIN LOSES COUNTER
  async retrieveWinCounter(username: string):Promise<number>{
    return new Promise(resolve => {
      this.http.get<WinHistory>('http://localhost:3000/game/wins\?username\=' + username).subscribe(data => {
        resolve (data.wins.length);
      })
    });
  }

  async retrieveLoseCounter(username: string): Promise<number>{
    return new Promise(resolve => {
      this.http.get<LoseHistory>('http://localhost:3000/game/loses\?username\=' + username).subscribe(data => {
        resolve (data.loses.length);
      })
    });
  }

  async retrieveGameCounter(username: string): Promise<number>{
    let nbWins = await this.retrieveWinCounter(username);
    let nbLoses = await this.retrieveLoseCounter(username);
    return new Promise(resolve => {
      resolve (nbWins + nbLoses);
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

    //Sorting
    gameHistory.sort((n1, n2) => {
      if (n1.id > n2.id) {
        return 1;
      }
      if (n1.id < n2.id) {
        return -1;
      }
      return 0;
    })

    return (gameHistory);
  }

  //DEBUG
  async testButton() {
    console.log('Username: ', this.jwtService.getPayload()?.username);

    const nbWins = await this.retrieveWinCounter('ugtheven');
    const nbLoses = await this.retrieveLoseCounter('ugtheven');
    const nbGames = await this.retrieveGameCounter('ugtheven');
    console.log('Nombre de victoires: ', nbWins);
    console.log('Nombre de defaites: ', nbLoses);
    console.log('Nombre de defaites: ', nbGames);

    const winHistory: Array<Game> = await this.retrieveWonGames('ugtheven');
    const loseHistory: Array<Game> = await this.retrieveLostGames('ugtheven');
    const gameHistory: Array<Game> = await this.retrieveUserHistory('ugtheven');
    console.log(winHistory);
    console.log(loseHistory);
    console.log(gameHistory);
  }
}
