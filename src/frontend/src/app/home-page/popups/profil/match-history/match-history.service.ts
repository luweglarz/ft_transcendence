import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs';

// interface WinHistory {
//   id: number;
//   createdAt: string;
//   winnerId: number;
//   winnerGoals: number;
//   loserId: number;
//   loserGoals: number;
// }

@Injectable({
  providedIn: 'root'
})
export class MatchHistoryService {

  //winHistory: Observable<WinHistory[]>;

  constructor(private http: HttpClient) { }

  getWinHistory() {
    console.log(this.http.get('/game/wins\?username\=ugtheven'));
  }
}
