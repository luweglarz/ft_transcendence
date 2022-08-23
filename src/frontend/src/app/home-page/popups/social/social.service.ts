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

  async getAllRelations(){
    // const relations: Array<Social> = [];
    // return new Promise((resolve) => {
    //   this.http
    //     .get<Array<Social>(
    //       `${environment.backend}/social`,
    //     )
    //     .subscribe((data) => {
    //       resolve(relations);
    //     });
    // });
    return (this.http.get<ArrayBuffer>('http://localhost:3000/social'));
  }

  getUserRelations(username: string){

  }

  addRelation(author: string, target: string, relation: Relation){

  }

}
