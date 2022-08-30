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

  getAllRelations(): Social[] {
    let relations: Social[] = [];
    this.http
      .get<Social[]>(`${environment.backend}/social`)
      .subscribe((val) => {
        relations = val;
      });
    return relations;
  }

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

  async loadUserSocial(username: string) {
    this.friends.splice(0, this.friends.length);
    this.blocked.splice(0, this.blocked.length);
    await this.getUserBlocked(username);
    await this.getUserFriends(username);
    this.isLoaded = true;
  }

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

  async blockUser(author: string, target: string) {
    this.http
      .get<any>(
        `${environment.backend}/social/add?author=` +
          author +
          '&target=' +
          target +
          '&relation=blocked',
      )
      .subscribe(() => {
        const foundIndex = this.friends.findIndex(
          (social) =>
            social.authorName === author && social.targetName === target,
        );
        if (foundIndex === -1)
          this.blocked.push(
            Object.assign(
              {},
              { authorName: author, targetName: target, relation: 'blocked' },
            ),
          );
        else {
          this.blocked.forEach((social, index) => {
            if (index === foundIndex) social.relation = 'blocked';
          });
        }
      });
    this.loadUserSocial(author);
  }

  async unblockUser(author: string, target: string) {
    this.http
      .get<any>(
        `${environment.backend}/social/add?author=` +
          author +
          '&target=' +
          target +
          '&relation=none',
      )
      .subscribe(() => {
        const foundIndex = this.blocked.findIndex(
          (social) =>
            social.authorName === author && social.targetName === target,
        );
        this.friends.forEach((social, index) => {
          if (index === foundIndex) social.relation = 'none';
        });
      });
    this.loadUserSocial(author);
  }

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

  isInGame() {
    return false;
  }

  isOnline() {
    return 'online';
  }
}
