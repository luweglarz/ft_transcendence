import { Injectable} from '@nestjs/common';
import { Prisma, Social } from '@prisma/client';
import { DbService } from 'src/db/db.service';

@Injectable()
export class SocialService {

    constructor(private prisma: DbService) {}

    async getMySocial(username: string){
        const user = await this.prisma.user.findUnique({
            where: { username: username },
        });
        return (user.mySocial);
    }

    async getTheirSocial(username: string){
        const user = await this.prisma.user.findUnique({
            where: { username: username },
          });
        return (user.theirSocial);
    }

    async createRelation(author: string, target:string){
        const authorUser = await this.prisma.user.findUnique({
          where: { username: author },
        });
        const targetUser = await this.prisma.user.findUnique({
          where: { username: target },
        });
        console.log(authorUser);
        console.log(targetUser)
        await this.prisma.social.create({
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
        return ('Created');
    }
}
