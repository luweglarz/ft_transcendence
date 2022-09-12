import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
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
    //private dmService: DirectMessagesService,
    private jwtService: JwtService,
  ) {
    const tmp = this.jwtService.username;
    if (tmp != undefined) this.username = tmp;
  }
  //Return the friendlist of the user
  async getUserFriends(username: string) {
    this.http
      .get<Social[]>(
        `${environment.backend}/social/friends?username=` + username,
      )
      .subscribe((val) => {
        val.forEach((data) => {
          console.log(data);
          this.friends.push(
            Object.assign(
              {},
              {
                authorName: data.authorName,
                targetName: data.targetName,
                relation: data.relation,
                status: data.relation,
              },
            ),
          );
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
          this.blocked.push(
            Object.assign(
              {},
              {
                authorName: data.authorName,
                targetName: data.targetName,
                relation: data.relation,
                status: data.relation,
              },
            ),
          );
        });
      });
  }

  //Load the friendlist and blockedlist of the user
  async loadUserSocial(username: string) {
    this.isLoaded = false;
    this.friends.splice(0, this.friends.length);
    this.blocked.splice(0, this.blocked.length);
    await this.getUserBlocked(username);
    await this.getUserFriends(username);
    this.isLoaded = true;
  }

  //Add a friend
  async friendUser(target: string) {
    this.http
      .post(
        `${environment.backend}/social/add?target=` +
          target +
          '&relation=friend',
        {},
      )
      .subscribe(() => {
        //const foundIndex = this.friends.findIndex(
        //  (social) =>
        //    social.authorName === this.username && social.targetName === target,
        //);
        //if (foundIndex === -1)
        //  this.friends.push(
        //    Object.assign(
        //      {},
        //      {
        //        authorName: this.username,
        //        targetName: target,
        //        relation: 'friend',
        //        //status: this.getUserStatus(target),
        //        status: 'offline',
        //      },
        //    ),
        //  );
        //else {
        //  this.friends.forEach((social, index) => {
        //    if (index === foundIndex) social.relation = 'friend';
        //  });
        //}
        this.loadUserSocial(this.username);
      });
    //this.loadUserSocial(this.username);
  }

  //Delete a friend
  async unfriendUser(target: string) {
    this.http
      .post(
        `${environment.backend}/social/add?target=` + target + '&relation=none',
        {},
      )
      .subscribe(() => {
        //const foundIndex = this.friends.findIndex(
        //  (social) =>
        //    social.authorName === this.username && social.targetName === target,
        //);
        //this.friends.forEach((social, index) => {
        //  if (index === foundIndex) social.relation = 'none';
        //});
        this.loadUserSocial(this.username);
      });
    //this.loadUserSocial(this.username);
  }

  //Block an user
  async blockUser(target: string) {
    this.http
      .post(
        `${environment.backend}/social/add?target=` +
          target +
          '&relation=blocked',
        {},
      )
      .subscribe(() => {
        //const foundIndex = this.friends.findIndex(
        //  (social) =>
        //    social.authorName === this.username && social.targetName === target,
        //);
        //if (foundIndex === -1)
        //  this.blocked.push(
        //    Object.assign(
        //      {},
        //      {
        //        authorName: this.username,
        //        targetName: target,
        //        relation: 'blocked',
        //        status: 'offline'
        //      },
        //    ),
        //  );
        //else {
        //  this.blocked.forEach((social, index) => {
        //    if (index === foundIndex) social.relation = 'blocked';
        //  });
        //}
        this.loadUserSocial(this.username);
      });
    //this.loadUserSocial(this.username);
  }

  //Unblock an user
  async unblockUser(target: string) {
    this.http
      .post(
        `${environment.backend}/social/add?target=` + target + '&relation=none',
        {},
      )
      .subscribe(() => {
        //const foundIndex = this.blocked.findIndex(
        //  (social) =>
        //    social.authorName === this.username && social.targetName === target,
        //);
        //this.friends.forEach((social, index) => {
        //  if (index === foundIndex) social.relation = 'none';
        //});
        this.loadUserSocial(this.username);
      });
    //this.loadUserSocial(this.username);
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
    let response = false;
    this.http
      .get<boolean>(`${environment.backend}/game/ingame?username=` + username)
      .subscribe((isInGame) => {
        response = isInGame;
      });
    return response;
  }

  //Return true if the user is online.
  isOnline(username: string): boolean {
    return true;
  }
}
