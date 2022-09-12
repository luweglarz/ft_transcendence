import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { DirectMessagesService } from './direct-messages.service';
import { Social } from './interfaces/social';
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
    public dmsService: DirectMessagesService,
  ) {
    const tmp = this.jwtService.username;
    if (tmp != undefined) this.username = tmp;
  }

  ngOnInit(): void {
    //
  }

  debugStatus(user: Social ,status: string, relation: string){
    console.log('User from social.component.html', user);
  }

  selectFriends() {
    this.showFriends = true;
  }

  selectBlocked() {
    this.showFriends = false;
  }

  openConversation(target: string) {
    this.dmsService.loadUserDms(this.username, target);
  }
}
