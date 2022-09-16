import { Controller, Get, Query } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { MatchmakingGatewayService } from 'src/pong/gateway/matchmaking/matchmaking-gateway.service';

class LadderPlayer {
  constructor(
    public username: string,
    public nbWins: number,
    public nbLoses: number,
    public score: number,
  ) {
    this.username = username;
    this.nbWins = nbWins;
    this.nbLoses = nbLoses;
    this.score = score;
  }
}

@Controller('game')
export class GameController {
  constructor(
    private prismaClient: DbService,
    private matchmaking: MatchmakingGatewayService,
  ) {}

  @Get('wins')
  async getUserWins(@Query('username') username: string) {
    const user = await this.prismaClient.user.findUnique({
      where: { username: username },
    });
    if (user == null) return 'User does not exist';
    const wins = await this.prismaClient.game.findMany({
      where: { winnerId: user.id },
    });
    return { wins: wins };
  }

  @Get('loses')
  async getUserLoses(@Query('username') username: string) {
    const user = await this.prismaClient.user.findUnique({
      where: { username: username },
    });
    if (user == null) return 'User does not exist';
    const loses = await this.prismaClient.game.findMany({
      where: { loserId: user.id },
    });
    return { loses: loses };
  }

  // LADDER
  @Get('ladder')
  async getLadder() {
    const ladder: Array<LadderPlayer> = [];

    const users = await this.prismaClient.user.findMany();
    if (users === null) return 'Error retrieving users';

    for (let i = 0; i < users.length; i++) {
      //username
      let username = '';
      if (users[i].username != undefined) username = users[i].username;

      //nbWins (in ranked mode);
      let nbWins = 0;
      const wins = await this.prismaClient.game.findMany({
        where: {
          winnerId: users[i].id,
        },
      });
      if (wins === null) return 'Error retrieving wins';
      nbWins = wins.filter((x) => x.type === 'ranked').length;

      //nbLoses (in ranked mode);
      let nbLoses = 0;
      const loses = await this.prismaClient.game.findMany({
        where: {
          loserId: users[i].id,
        },
      });
      if (loses === null) return 'Error retrieving loses';
      nbLoses = loses.filter((x) => x.type === 'ranked').length;

      //Score (calculated on ranked matchs)
      let score = 0;
      if (nbWins === 0 && nbLoses === 0) score = 0;
      else if (nbWins != 0 && nbLoses === 0) score = nbWins * 350;
      else score = Math.round((nbWins / nbLoses) * 1000);

      //Push the player in the ladder
      const player = new LadderPlayer(username, nbWins, nbLoses, score);
      ladder.push(player);
    }

    //Sorting
    ladder.sort((n1, n2) => {
      if (n1.score < n2.score) {
        return 1;
      }
      if (n1.score > n2.score) {
        return -1;
      }
      return 0;
    });

    //Return
    return ladder;
  }
}
