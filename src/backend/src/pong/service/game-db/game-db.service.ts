import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Player } from 'src/pong/class/player/player';

@Injectable()
export class GameDbService {

    constructor(private prismaClient: DbService){}

    async pushGameDb(winner: Player, loser: Player){
        const winnerUser = await this.prismaClient.user.findUnique({
            where: { username: winner.username },
          });
        const loserUser = await this.prismaClient.user.findUnique({
            where: { username: loser.username },
        });
        await this.prismaClient.game.create({
          data: {
            winner: {
              connect: { id: winnerUser.id}
            },
            winnerGoals : winner.goals,
            loser: {
              connect: {id: loserUser.id}
            },
            loserGoals: loser.goals,
          }
        })
      }

}
