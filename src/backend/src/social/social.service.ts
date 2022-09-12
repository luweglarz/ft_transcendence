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
  constructor(
    private prisma: DbService,
    @Inject(forwardRef(() => FriendsStatusGateway))
    private friendsStatusGateway: FriendsStatusGateway,
  ) {
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
    const formatedRelations: Social[] = [];
    userRelations.forEach((element) => {
      formatedRelations.push(
        Object.assign(
          {},
          {
            authorName: element.authorName,
            targetName: element.targetName,
            relation: element.relation,
            status: 'offline',
          },
        ),
      );
    });
    formatedRelations.forEach((relation) => {
      for (const onlineUser of this.friendsStatusGateway.onlineUsers.keys()) {
        if (onlineUser === relation.targetName) relation.status = 'online';
      }
    });

    //return userRelations;
    return formatedRelations;
  }

  async getUserFriends(username: string) {
    const userFriends = await this.prisma.social.findMany({
      where: {
        authorName: username,
        relation: 'friend',
      },
    });

    const formatedRelations: Social[] = [];
    userFriends.forEach((element) => {
      formatedRelations.push(
        Object.assign(
          {},
          {
            authorName: element.authorName,
            targetName: element.targetName,
            relation: element.relation,
            status: 'offline',
          },
        ),
      );
    });
    formatedRelations.forEach((relation) => {
      for (const onlineUser of this.friendsStatusGateway.onlineUsers.keys()) {
        if (onlineUser === relation.targetName) relation.status = 'online';
      }
    });

    //return userFriends;
    return formatedRelations;
  }

  async getUserBlocked(username: string) {
    const userBlocked = await this.prisma.social.findMany({
      where: {
        authorName: username,
        relation: 'blocked',
      },
    });

    const formatedRelations: Social[] = [];
    userBlocked.forEach((element) => {
      formatedRelations.push(
        Object.assign(
          {},
          {
            authorName: element.authorName,
            targetName: element.targetName,
            relation: element.relation,
            status: 'offline',
          },
        ),
      );
    });
    formatedRelations.forEach((relation) => {
      for (const onlineUser of this.friendsStatusGateway.onlineUsers.keys()) {
        if (onlineUser === relation.targetName) relation.status = 'online';
      }
    });

    //return userBlocked;
    return formatedRelations;
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
