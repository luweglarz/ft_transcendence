import { HttpService } from '@nestjs/axios';
import { Injectable} from '@nestjs/common';
import { Relation } from '@prisma/client';
import { DbService } from 'src/db/db.service';

@Injectable()
export class SocialService {

  constructor(private prisma: DbService, private http: HttpService) {}

  getSocial(){
    const socialList = this.prisma.social.findMany();
    return (socialList);
  }

  getUserFriends(username: string){
    const userFriends = this.prisma.social.findMany({
      where: {
        authorName: username,
        relation: 'friend',
      }
    });
    return (userFriends);
  }

  getUserBlocked(username: string){
    const userBlocked = this.prisma.social.findMany({
      where: {
        authorName: username,
        relation: 'blocked',
      }
    });
    return (userBlocked);
  }

  addUserRelation(author: string, target: string, relation: Relation){
    const newRelation = this.prisma.social.create({
      data: {
        authorName: author,
        targetName: target,
        relation: relation,
      }
    });
    return (newRelation);
  }

  updateUserRelation(author: string, target: string, relation: Relation){
    const updatedRelation = this.prisma.social.updateMany({
      where: {
        authorName: author,
        targetName: target,
      },
      data: {
        relation: relation,
      }
    });
    return (updatedRelation);
  }

}
