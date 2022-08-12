import { Socket } from 'ngx-socket-io';
import { Ball } from '../ball';
import { Player } from '../player';

export class CustomGame {
  constructor(
    private _canvaHeight: number,
    private _canvaWidth: number,
    private _backgroundColor: string,
    private _players: Player[],
    private _ball: Ball,
  ) {}
  get canvaHeight(): number {
    return this._canvaHeight;
  }
  get canvaWidth(): number {
    return this._canvaWidth;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  get players(): Player[] {
    return this._players;
  }

  get ball(): Ball {
    return this._ball;
  }

  onGameUpdate(socket: Socket) {
    socket.on(
      'customGameUpdate',
      (
        player1Pos: any,
        player2Pos: any,
        ballPos: any,
        score: any,
        playerHeights?: any,
        playerWidth?: any,
        playersCd?: any,
      ) => {
        this.players[0].x = player1Pos.x;
        this.players[0].y = player1Pos.y;
        this.players[1].x = player2Pos.x;
        this.players[1].y = player2Pos.y;
        this.ball.x = ballPos.x;
        this.ball.y = ballPos.y;
        this.players[0].goals = score.playerOneGoals;
        this.players[1].goals = score.playerTwoGoals;
        this.players[0].height = playerHeights.player1Height;
        this.players[1].height = playerHeights.player2Height;
        this.players[0].width = playerWidth.player1Width;
        this.players[1].width = playerWidth.player2Width;
        this.players[0].boostCd = playersCd.player1Cd;
        this.players[1].boostCd = playersCd.player2Cd;
      },
    );
  }
}
