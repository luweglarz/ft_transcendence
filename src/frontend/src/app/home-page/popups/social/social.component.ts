import { Component, OnInit } from '@angular/core';
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

  users :Array<Social> = [];
  showFriends: boolean = true;

  constructor(public socialService: SocialService) {
    this.users = this.socialService.getAllRelations();
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

  getBlockedUser() {
    return (this.users.filter((item) => item.relation === 0));
  }

  getFriendUser() {
    return (this.users.filter((item) => item.relation === 1));
  }

  unblockUser(username: string) {
    this.users.forEach((user, index) => {
      if (user.targetName === username)
        user.relation = 2;
    });
  }

  unfriendUser(username: string) {
    this.users.forEach((user, index) => {
      if (user.targetName === username)
        user.relation = 2;
    });
  }

  openConversation(username: string){
    console.log(username);
  }
}
