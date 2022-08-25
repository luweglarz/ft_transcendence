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
  isLoaded: boolean = false;

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
     this.http.get<Social[]>('http://localhost:3000/social/friends?username=' + username).subscribe(val => {
        console.log('Friends', val);
        val.forEach((data) => {
          this.friends.push(Object.assign({}, data));
        })
     });
   }

   async getUserBlocked(username: string){
     this.http.get<Social[]>('http://localhost:3000/social/blocked?username=' + username).subscribe(val => {
        console.log('Blocked' ,val);
        val.forEach((data) => {
          this.blocked.push(Object.assign({}, data));
        })
     });
   }

  async loadUserSocial(username: string){
    await this.getUserBlocked(username);
    await this.getUserFriends(username);
    this.isLoaded = true;
  }

  updateUserRelation(author: string, target: string, relation: string) {
    this.http.post('http://localhost:3000/social/add?author=' + author + '&target=' + target + '&relation=' + relation, '');
  }

}
