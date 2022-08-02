import { Component, OnInit } from '@angular/core';
import { ProfilInfoService } from '../profil-info.service';

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css']
})
export class MatchHistoryComponent implements OnInit {

  constructor(public profilInfoService: ProfilInfoService) { }

  ngOnInit(): void {
  }

}
