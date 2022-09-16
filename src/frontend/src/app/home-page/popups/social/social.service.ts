import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { environment } from 'src/environments/environment';
import { Social } from './interfaces/social';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  username = '';
  friends: Social[] = [];
  blocked: Social[] = [];
  isLoaded = false;

  constructor(private http: HttpClient, private jwtService: JwtService) {
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
          this.friends.push(
            Object.assign(
              {},
              {
                authorName: data.authorName,
                targetName: data.targetName,
                relation: data.relation,
                status: data.status,
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
                status: data.status,
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
        this.loadUserSocial(this.username);
      });
  }

  //Delete a friend
  async unfriendUser(target: string) {
    this.http
      .post(
        `${environment.backend}/social/add?target=` + target + '&relation=none',
        {},
      )
      .subscribe(() => {
        this.loadUserSocial(this.username);
      });
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
        this.loadUserSocial(this.username);
      });
  }

  //Unblock an user
  async unblockUser(target: string) {
    this.http
      .post(
        `${environment.backend}/social/add?target=` + target + '&relation=none',
        {},
      )
      .subscribe(() => {
        this.loadUserSocial(this.username);
      });
  }

  //Return the relations status between 2 users
  checkUserRelation(author: string, target: string | undefined): string {
    if (target === undefined) return '';
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
}
