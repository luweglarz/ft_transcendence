import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class SocialService {
  constructor(private prisma: DbService, private http: HttpService) {}

  getSocial() {
    const socialList = this.prisma.social.findMany();
    return socialList;
  }

  getUserRelations(username: string) {
    const userRelations = this.prisma.social.findMany({
      where: {
        authorName: username,
      },
    });
    return userRelations;
  }

  getUserFriends(username: string) {
    const userFriends = this.prisma.social.findMany({
      where: {
        authorName: username,
        relation: 'friend',
      },
    });
    return userFriends;
  }

  getUserBlocked(username: string) {
    const userBlocked = this.prisma.social.findMany({
      where: {
        authorName: username,
        relation: 'blocked',
      },
    });
    return userBlocked;
  }

  async addUserRelation(author: string, target: string, relation: string) {
    console.log('Received a post request');
    const tmp = await this.getUserRelations(author);
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].authorName === author && tmp[i].targetName === target)
        return this.updateUserRelation(author, target, relation);
    }
    const newRelation = await this.prisma.social.create({
      data: {
        authorName: author,
        targetName: target,
        relation: relation,
      },
    });
    return newRelation;
  }

  async updateUserRelation(author: string, target: string, relation: string) {
    const updatedRelation = await this.prisma.social.updateMany({
      where: {
        authorName: author,
        targetName: target,
      },
      data: {
        relation: relation,
      },
    });
    return updatedRelation;
  }
}
