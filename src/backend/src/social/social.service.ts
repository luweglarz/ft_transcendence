import { Injectable} from '@nestjs/common';
import { Prisma, Social } from '@prisma/client';
import { DbService } from 'src/db/db.service';

enum Relation {
    friend,
    blocked,
    none,
}

@Injectable()
export class SocialService {

    constructor(private prisma: DbService) {}

    getRelations(){
        return (this.prisma.social);
    }

    async createRelation(){
        const authorUser = await this.prisma.user.findUnique({
          where: { username: 'ugtheven' },
        });
        const targetUser = await this.prisma.user.findUnique({
          where: { username: 'usertest' },
        });
        console.log(authorUser);
        console.log(targetUser)
        this.prisma.social.create({
            data: {
              author: {
                connect: { authorId: authorUser.id },
              },
              target: {
                connect: { targetId: targetUser.id },
              },
              relation: 'friend',
            },
          });
    }
}
