import { HttpService } from '@nestjs/axios';
import { Injectable} from '@nestjs/common';
import { Relation, Social } from '@prisma/client';
import { DbService } from 'src/db/db.service';

@Injectable()
export class SocialService {

  constructor(private prisma: DbService, private http: HttpService) {}

  getSocial(){
    const socialList = this.prisma.social.findMany();
    return (socialList);
  }

  getUserSocial(username: string){
    const userSocialList = this.prisma.social.findMany({
      where: { authorName: username }
    });
    return (userSocialList);
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
