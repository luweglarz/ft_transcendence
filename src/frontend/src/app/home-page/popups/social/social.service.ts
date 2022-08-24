import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  friends: Social[] = [];
  blocked: Social[] = [];

  constructor(private http: HttpClient) {
    //
  }

  getAllRelations(): Social[]{
    let relations: Social[] = []
    this.http.get<Social[]>('http://localhost:3000/social').subscribe(val => {
      relations = val;
    });
    return (relations);
  }

   async getUserFriends(username: string){
     let friends: Social[] = []
     this.http.get<Social[]>('http://localhost:3000/social/friends?username=' + username).subscribe(val => {
        console.log('Friends', val);
        friends = val;
     });
     return (friends);
   }

   async getUserBlocked(username: string){
     let blocked: Social[] = []
     this.http.get<Social[]>('http://localhost:3000/social/blocked?username=' + username).subscribe(val => {
        console.log('Blocked' ,val);
        blocked = val;
     });
     return (blocked);
   }

  async loadUserSocial(username: string){
    // this.friends = await this.getUserFriends(username);
    // this.blocked = await this.getUserBlocked(username);
    await this.getUserFriends(username).then((data) => {
      data.forEach((val) => {
        this.friends.push(Object.assign({}, val));
        console.log(val);
      });
    });
    await this.getUserBlocked(username).then((data) => {
      data.forEach((val) => {
        this.blocked.push(Object.assign({}, val));
        console.log(val);
      });
    });
  }

}
