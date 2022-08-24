import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { SocialService } from './social.service';

enum Relation {
  friend,
  blocked,
  none,
}

interface Social {
  authorName: string,
  targetName: string,
  relation: Relation,
}


@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css'],
})
export class SocialComponent implements OnInit {

  showFriends: boolean = true;
  username: string = '';

  constructor(public socialService: SocialService, public jwtService: JwtService) {
    const tmp = this.jwtService.getPayload()?.username;
    if (tmp != undefined)
      this.username = tmp;
  }

  ngOnInit(): void {
    //
  }

  selectFriends() {
    this.showFriends = true
  }

  selectBlocked() {
    this.showFriends = false;

  }

  unblockUser(username: string) {
    //
  }

  unfriendUser(username: string) {
    //
  }

  openConversation(username: string){
    //
  }
}
