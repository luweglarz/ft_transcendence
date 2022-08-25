import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface Social {
  authorName: string,
  targetName: string,
  relation: string,
}

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  friends: Social[] = [];
  blocked: Social[] = [];
  isLoaded: boolean = false;

  constructor(private http: HttpClient) {
    //
  }

  getAllRelations(): Social[]{
    let relations: Social[] = []
    this.http.get<Social[]>(`${environment.backend}/social`).subscribe(val => {
      relations = val;
    });
    return (relations);
  }

   async getUserFriends(username: string){
     this.http.get<Social[]>(`${environment.backend}/social/friends?username=` + username).subscribe(val => {
        val.forEach((data) => {
          this.friends.push(Object.assign({}, data));
        })
     });
   }

   async getUserBlocked(username: string){
     this.http.get<Social[]>(`${environment.backend}/social/blocked?username=` + username).subscribe(val => {
        val.forEach((data) => {
          this.blocked.push(Object.assign({}, data));
        })
     });
   }

  async loadUserSocial(username: string){
    this.friends.splice(0, this.friends.length);
    this.blocked.splice(0, this.blocked.length);
    await this.getUserBlocked(username);
    await this.getUserFriends(username);
    this.isLoaded = true;
  }

  async updateUserRelation(author: string, target: string, relation: string) {
    this.http.get<any>(`${environment.backend}/social/add?author=` + author + '&target=' + target + '&relation=' + relation).subscribe(val => {
      this.friends.push(Object.assign({}, {authorName: author, targetName: target, relation: relation}));
    });
    this.loadUserSocial(author);
  }

  async friendUser(author: string, target: string) {
    this.http.get<any>(`${environment.backend}/social/add?author=` + author + '&target=' + target + '&relation=friend').subscribe(val => {
      const foundIndex = this.friends.findIndex(social => social.authorName === author && social.targetName === target);
      if (foundIndex === -1)
        this.friends.push(Object.assign({}, {authorName: author, targetName: target, relation: 'friend'}));
      else {
        this.friends.forEach((social, index) => {
          if (index === foundIndex)
            social.relation = 'friend';
        });
      }
    });
    this.loadUserSocial(author);
  }

  async unfriendUser(author: string, target: string) {
    this.http.get<any>(`${environment.backend}/social/add?author=` + author + '&target=' + target + '&relation=none').subscribe(val => {
      const foundIndex = this.friends.findIndex(social => social.authorName === author && social.targetName === target);
      this.friends.forEach((social, index) => {
        if (index === foundIndex)
          social.relation = 'none';
      });
    });
    this.loadUserSocial(author);
  }

  async blockUser(author: string, target: string) {
    this.http.get<any>(`${environment.backend}/social/add?author=` + author + '&target=' + target + '&relation=blocked').subscribe(val => {
      const foundIndex = this.friends.findIndex(social => social.authorName === author && social.targetName === target);
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

  async unblockUser(author: string, target: string) {
    this.http.get<any>(`${environment.backend}/social/add?author=` + author + '&target=' + target + '&relation=none').subscribe(val => {
      const foundIndex = this.blocked.findIndex(social => social.authorName === author && social.targetName === target);
      this.friends.forEach((social, index) => {
        if (index === foundIndex)
          social.relation = 'none';
      });
    });
    this.loadUserSocial(author);
  }

}
