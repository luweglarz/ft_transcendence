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

  username: string = '';
  nbGames: number = 0;
  nbWins: number = 0;
  nbLoses: number = 0;
  score: number = 0;
  winStreak: number = 0;
  loseStreak: number = 0;
  winHistory: Array<Game> = [];
  loseHistory: Array<Game> = [];
  gameHistory: Array<Game> = [];

  constructor(private http: HttpClient, private jwtService: JwtService) {
    this.loadUserProfil('ugtheven');
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

  async retrieveScore(username: string): Promise<number>{
    let nbWins = await this.retrieveWinCounter(username);
    let nbLoses = await this.retrieveLoseCounter(username);
    return new Promise(resolve => {
      if (nbWins === 0 && nbLoses === 0)
        resolve(0);
      else if (nbWins != 0 && nbLoses === 0)
        resolve (nbWins * 350);
      else
        resolve (Math.round((nbWins / nbLoses) * 1000));
    });
  }

  async retrieveWinStreak(username: string): Promise<number>{
    let winHistory: Array<Game> = await this.retrieveWonGames(username);
    return new Promise(resolve => {
      let biggestSpan: number = 0;
      let actualSpan: number = 0;
      if (winHistory.length == 1)
        resolve(1);
      for (let i = 1; i < winHistory.length; i++){
        if (winHistory[i - 1].id === winHistory[i].id - 1 && actualSpan === 0)
          actualSpan = 2;
        else if (winHistory[i - 1].id === winHistory[i].id - 1 && actualSpan != 0)
          actualSpan++;
        else if (winHistory[i - 1].id != winHistory[i].id - 1 && actualSpan != 0){
          if (actualSpan > biggestSpan)
            biggestSpan = actualSpan;
          actualSpan = 0;
        }
      }
      resolve (actualSpan > biggestSpan ? actualSpan: biggestSpan);
    });
  }

  async retrieveLoseStreak(username: string): Promise<number>{
    let loseHistory: Array<Game> = await this.retrieveLostGames(username);
    return new Promise(resolve => {
      let biggestSpan: number = 0;
      let actualSpan: number = 0;
      if (loseHistory.length == 1)
        resolve(1);
      for (let i = 1; i < loseHistory.length; i++){
        if (loseHistory[i - 1].id === loseHistory[i].id - 1 && actualSpan === 0)
          actualSpan = 2;
        else if (loseHistory[i - 1].id === loseHistory[i].id - 1 && actualSpan != 0)
          actualSpan++;
        else if (loseHistory[i - 1].id != loseHistory[i].id - 1 && actualSpan != 0){
          if (actualSpan > biggestSpan)
            biggestSpan = actualSpan;
          actualSpan = 0;
        }
      }
      resolve (actualSpan > biggestSpan ? actualSpan: biggestSpan);
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

  async loadUserProfil(username: string) {
    this.nbGames = await this.retrieveGameCounter(username);
    this.nbWins = await this.retrieveWinCounter(username);
    this.nbLoses = await this.retrieveLoseCounter(username);
    this.score = await this.retrieveScore(username);
    this.winStreak = await this.retrieveWinStreak(username);
    this.loseStreak = await this.retrieveLoseStreak(username);
    this.winHistory = await this.retrieveWonGames(username);
    this.loseHistory = await this.retrieveLostGames(username);
    this.gameHistory = await this.retrieveUserHistory(username);
  }

  //DEBUG
  async testUgtheven() {
    await this.loadUserProfil('ugtheven');
    console.log('Nombre de victoires: ', this.nbWins);
    console.log('Nombre de defaites: ', this.nbLoses);
    console.log('Nombre de games: ', this.nbGames);
    console.log('Score: ', this.score);
    console.log('Win Streak: ', this.winStreak);
    console.log('Lose Streak: ', this.loseStreak);
    console.log('Win History: ', this.winHistory);
    console.log('Lose History: ', this.loseHistory);
    console.log('Game History: ', this.gameHistory);
  }

  async testUsertest() {
    await this.loadUserProfil('usertest');
    console.log('Nombre de victoires: ', this.nbWins);
    console.log('Nombre de defaites: ', this.nbLoses);
    console.log('Nombre de games: ', this.nbGames);
    console.log('Score: ', this.score);
    console.log('Win Streak: ', this.winStreak);
    console.log('Lose Streak: ', this.loseStreak);
    console.log('Win History: ', this.winHistory);
    console.log('Lose History: ', this.loseHistory);
    console.log('Game History: ', this.gameHistory);
  }
}
