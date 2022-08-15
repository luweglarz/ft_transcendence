import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PopupsService } from '../popups.service';

interface Player {
  nbLoses: number;
  nbWins: number;
  score: number;
  username: string;
}

@Component({
  selector: 'app-ladder',
  templateUrl: './ladder.component.html',
  styleUrls: ['./ladder.component.css'],
})
export class LadderComponent implements OnInit {

  ladder: Array<Player> = [];
  isLoaded: boolean = false;

  constructor(private http: HttpClient, public popupsService: PopupsService ) {
    this.http.get<Array<Player>>(`${environment.backend}/game/ladder`).subscribe((data) => {
      this.ladder = data;
      this.isLoaded = true;
    });
  }

  ngOnInit(): void {
    //
  }

}
