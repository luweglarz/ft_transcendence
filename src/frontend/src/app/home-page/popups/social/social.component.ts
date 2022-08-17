import { Component, OnInit } from '@angular/core';

interface User{
  username: string;
  friend: boolean;
  blocked: boolean;
  online: boolean;
}

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css'],
})
export class SocialComponent implements OnInit {

  users :Array<User> = [{
    username:'ugtheven',
    friend:true,
    blocked:false,
    online:true,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:true,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:false,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:true,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:false,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:false,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:true,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:false,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:true,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:false,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:true,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:false,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:false,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:true,
  },{
    username:'usertest',
    friend:true,
    blocked:false,
    online:false,
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

}
