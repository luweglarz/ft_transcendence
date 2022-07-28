import { Component, OnInit } from '@angular/core';
import { MatchHistoryService } from './match-history.service';

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css']
})
export class MatchHistoryComponent implements OnInit {

  constructor(public matchHistoryService: MatchHistoryService) { }

  ngOnInit(): void {
  }

}
