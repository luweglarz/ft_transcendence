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
        console.log(val);
        friends = val;
     });
     return (friends);
   }

   async getUserBlocked(username: string){
     let blocked: Social[] = []
     this.http.get<Social[]>('http://localhost:3000/social/blocked?username=' + username).subscribe(val => {
        console.log(val);
        blocked = val;
     });
     return (blocked);
   }


}
