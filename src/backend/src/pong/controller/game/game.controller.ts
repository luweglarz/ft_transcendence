import { Controller, Get, Query } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Controller('game')
export class GameController {
  constructor(private prismaClient: DbService) {}

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
}
