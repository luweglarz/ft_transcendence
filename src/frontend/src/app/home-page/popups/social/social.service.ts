import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DirectMessagesService } from './direct-messages.service';
import { Social } from './interfaces/social';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  username = '';
  friends: Social[] = [];
  blocked: Social[] = [];
  isLoaded = false;

  constructor(
    private http: HttpClient,
    private dmService: DirectMessagesService,
  ) {}

  //Return the friendlist of the user
  async getUserFriends(username: string) {
    this.http
      .get<Social[]>(
        `${environment.backend}/social/friends?username=` + username,
      )
      .subscribe((val) => {
        val.forEach((data) => {
          this.friends.push(Object.assign({}, data));
        });
      });
  }

  //Return the blocklist of the user
  async getUserBlocked(username: string) {
    this.http
      .get<Social[]>(
        `${environment.backend}/social/blocked?username=` + username,
      )
      .subscribe((val) => {
        val.forEach((data) => {
          this.blocked.push(Object.assign({}, data));
        });
      });
  }

  //Load the friendlist and blockedlist of the user
  async loadUserSocial(username: string) {
    this.friends.splice(0, this.friends.length);
    this.blocked.splice(0, this.blocked.length);
    await this.getUserBlocked(username);
    await this.getUserFriends(username);
    this.isLoaded = true;
  }

  //Add a friend
  async friendUser(author: string, target: string) {
    this.http
      .get<any>(
        `${environment.backend}/social/add?author=` +
          author +
          '&target=' +
          target +
          '&relation=friend',
      )
      .subscribe(() => {
        const foundIndex = this.friends.findIndex(
          (social) =>
            social.authorName === author && social.targetName === target,
        );
        if (foundIndex === -1)
          this.friends.push(
            Object.assign(
              {},
              { authorName: author, targetName: target, relation: 'friend' },
            ),
          );
        else {
          this.friends.forEach((social, index) => {
            if (index === foundIndex) social.relation = 'friend';
          });
        }
      });
    this.loadUserSocial(author);
  }

  //Delete a friend
  async unfriendUser(author: string, target: string) {
    this.http
      .get<any>(
        `${environment.backend}/social/add?author=` +
          author +
          '&target=' +
          target +
          '&relation=none',
      )
      .subscribe(() => {
        const foundIndex = this.friends.findIndex(
          (social) =>
            social.authorName === author && social.targetName === target,
        );
        this.friends.forEach((social, index) => {
          if (index === foundIndex) social.relation = 'none';
        });
      });
    this.loadUserSocial(author);
  }

  //Block an user
  async blockUser(author: string, target: string) {
    this.http.get<any>(`${environment.backend}/social/add?author=` + author + '&target=' + target + '&relation=blocked').subscribe(() => {
      const foundIndex = this.friends.findIndex((social) => social.authorName === author && social.targetName === target);
      if (foundIndex === -1)
        this.blocked.push(Object.assign({}, {authorName: author, targetName: target, relation: 'blocked'}));
      else {
        this.blocked.forEach((social, index) => {
          if (index === foundIndex)
           social.relation = 'blocked';
        });
      }
    });
    this.http.post(`${environment.backend}/social/add?author=` + author + '&target=' + target + '&relation=blocked', {}).subscribe(() => {
      const foundIndex = this.friends.findIndex((social) => social.authorName === author && social.targetName === target);
      if (foundIndex === -1)
        this.blocked.push(Object.assign({}, {authorName: author, targetName: target, relation: 'blocked'}));
      else {
        this.blocked.forEach((social, index) => {
          if (index === foundIndex)
           social.relation = 'blocked';
        });
      }
    });
    this.loadUserSocial(author);
  }

  //Unblock an user
  async unblockUser(author: string, target: string) {
    this.http.get<any>(`${environment.backend}/social/add?author=` + author + '&target=' + target + '&relation=none').subscribe(() => {
      const foundIndex = this.blocked.findIndex((social) =>social.authorName === author && social.targetName === target,);
      this.friends.forEach((social, index) => {
        if (index === foundIndex)
          social.relation = 'none';
      });
    });
    this.http.post(`${environment.backend}/social/add?author=` + author + '&target=' + target + '&relation=none', {}).subscribe(() => {
      const foundIndex = this.blocked.findIndex((social) =>social.authorName === author && social.targetName === target,);
      this.friends.forEach((social, index) => {
        if (index === foundIndex)
          social.relation = 'none';
      });
    });
    this.loadUserSocial(author);
  }

  //Return the relations status between 2 users
  checkUserRelation(author: string, target: string): string {
    let foundIndex = this.blocked.findIndex(
      (social) => social.authorName === author && social.targetName === target,
    );
    if (foundIndex === -1) {
      foundIndex = this.friends.findIndex(
        (social) =>
          social.authorName === author && social.targetName === target,
      );
      if (foundIndex != -1) return 'friend';
      else return 'none';
    } else return 'blocked';
  }

  //Return true if the user is actually playing a game.
  isInGame(username: string): boolean {
    let response: boolean = false;
    this.http.get<boolean>(`${environment.backend}/game/ingame?username=` + username).subscribe(isInGame => {
      //console.log(isInGame);
      response = isInGame;
    });
    return (response);
  }

  //Return true if the user is online.
  isOnline(username: string): boolean {
    return (true);
  }

  //Return the status of the user
  getUserStatus(username: string){
    if (this.isOnline(username) == true){
      if (this.isInGame(username) == true){
        //console.log('ingame : ');
        return ('ingame');
      }
      else{
        //console.log('online', ' | isInGame = ', this.isInGame(username));
        return ('online');
      }
    }
    else{
      //console.log('offline');
      return ('offline');
    }
  }
}
