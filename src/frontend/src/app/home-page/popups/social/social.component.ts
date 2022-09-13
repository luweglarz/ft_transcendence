import { Component, OnInit } from '@angular/core';
import { SocialService } from './social.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css'],
})
export class SocialComponent implements OnInit {
  username = '';

  constructor(
    public socialService: SocialService
  ) {
    //
  }

  ngOnInit(): void {
    //
  }
}
