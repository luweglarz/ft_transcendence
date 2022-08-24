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
    this.getFriendUser();
    this.getBlockedUser();
  }

  ngOnInit(): void {
    //
  }

  selectFriends() {
    this.showFriends = true;
    console.log(this.friends);
  }

  selectBlocked() {
    this.showFriends = false;
    console.log(this.blocked);
  }

  async getFriendUser() {
    this.friends = await this.socialService.getUserFriends(this.username);
  }

  async getBlockedUser() {
    this.blocked = await this.socialService.getUserBlocked(this.username);
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
