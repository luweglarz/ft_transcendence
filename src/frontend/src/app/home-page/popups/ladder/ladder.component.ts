import { Component, OnInit } from '@angular/core';

interface Player {
  username: string;
  score: number;
  wins: number;
  loses: number;
}

@Component({
  selector: 'app-ladder',
  templateUrl: './ladder.component.html',
  styleUrls: ['./ladder.component.css'],
})
export class LadderComponent implements OnInit {



  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }
}
