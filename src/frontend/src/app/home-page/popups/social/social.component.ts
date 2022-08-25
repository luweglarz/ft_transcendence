import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { SocialService } from './social.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css'],
})
export class SocialComponent implements OnInit {
  showFriends = true;
  username = '';

  constructor(
    public socialService: SocialService,
    public jwtService: JwtService,
  ) {
    const tmp = this.jwtService.getPayload()?.username;
    if (tmp != undefined) this.username = tmp;
  }

  ngOnInit(): void {
    //
  }

  selectFriends() {
    this.showFriends = true;
  }

  selectBlocked() {
    this.showFriends = false;
  }

  openConversation(username: string) {
    console.log(username);
  }
}
