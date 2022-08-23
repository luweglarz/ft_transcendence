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
  friends: Social[] = [];
  blocked: Social[] = [];

  constructor(public socialService: SocialService, public jwtService: JwtService) {
    const tmp = this.jwtService.getPayload()?.username;
    if (tmp != undefined)
      this.username = tmp;
    this.friends = this.getFriendUser();
    this.blocked = this.getBlockedUser();
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

  getFriendUser() {
    console.log('Je recup les users friends');
    console.log(this.socialService.getUserFriends(this.username));
    return (this.socialService.getUserFriends(this.username));
  }

  getBlockedUser() {
    console.log('Je recup les users blocked');
    console.log(this.socialService.getUserBlocked(this.username));
    return (this.socialService.getUserBlocked(this.username));
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
