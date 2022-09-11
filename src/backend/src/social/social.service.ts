import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { FriendsStatusGateway } from './gateway/friends-status-gateway.gateway';

export interface Social {
  authorName: string;
  targetName: string;
  relation: string;
  status: string;
}

@Injectable()
export class SocialService {
  constructor(private prisma: DbService, @Inject(forwardRef(() => FriendsStatusGateway)) friendsStatusGateway: FriendsStatusGateway) {
    //
  }

  getSocial() {
    const socialList = this.prisma.social.findMany();
    return socialList;
  }

  async getUserRelations(username: string) {
    const userRelations = await this.prisma.social.findMany({
      where: {
        authorName: username,
      },
    });

    //
    let formatedRelations: Social[] = [];
    userRelations.forEach(element => {
      formatedRelations.push(Object.assign({},
          {
            authorName: element.authorName,
            targetName: element.targetName,
            relation: element.relation,
            status: 'offline',
          },
        ),
      );
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
