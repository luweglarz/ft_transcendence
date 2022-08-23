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

  getUserRelations(username: string){
    let relations: Social[] = []
    this.http.get<Social[]>('http://localhost:3000/social/relations?username=' + username).subscribe(val => {
      relations = val;
    });
    return (relations);
  }

  addRelation(author: string, target: string, relation: Relation){

  }

}
