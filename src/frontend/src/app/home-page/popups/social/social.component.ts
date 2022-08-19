import { Component, OnInit } from '@angular/core';

interface User{
  username: string;
  relation: string;
  status: string;
}

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css'],
})
export class SocialComponent implements OnInit {

  users :Array<User> = [{
    username:'ugtheven',
    relation:'friend',
    status:'ingame',
  },{
    username:'usertest',
    relation:'blocked',
    status:'offline',
  },{
    username:'usertest1',
    relation:'blocked',
    status:'offline',
  },{
    username:'usertest2',
    relation:'friend',
    status:'online',
  },{
    username:'usertest3',
    relation:'none',
    status:'online',
  },{
    username:'usertest4',
    relation:'none',
    status:'online',
  },{
    username:'usertest5',
    relation:'none',
    status:'ingame',
  },{
    username:'usertest6',
    relation:'none',
    status:'offline',
  },{
    username:'usertest7',
    relation:'none',
    status:'online',
  },{
    username:'usertest8',
    relation:'friend',
    status:'ingame',
  },{
    username:'usertest9',
    relation:'none',
    status:'offline',
  },{
    username:'usertest10',
    relation:'friend',
    status:'online',
  },{
    username:'usertest11',
    relation:'none',
    status:'online',
  },{
    username:'usertest12',
    relation:'none',
    status:'ingame',
  },{
    username:'usertest13',
    relation:'none',
    status:'ingame',
  },];
  showFriends: boolean = true;

  constructor() {
    //
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
    return (this.users.filter((item) => item.relation === 'blocked'));
  }

  getFriendUser() {
    return (this.users.filter((item) => item.relation === 'friend'));
  }

  unblockUser(username: string) {
    this.users.forEach((user, index) => {
      if (user.username === username)
        user.relation = 'none';
    });
  }

  unfriendUser(username: string) {
    this.users.forEach((user, index) => {
      if (user.username === username)
        user.relation = 'none';
    });
  }

  openConversation(username: string){
    console.log(username);
  }
}
