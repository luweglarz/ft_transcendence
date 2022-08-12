import { Socket } from 'ngx-socket-io';
import { GameMode } from '../../interface/game-mode';
import { Ball } from '../ball';
import { Player } from '../player';

export class NormalGame implements GameMode {
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
      'normalGameUpdate',
      (player1Pos: any, player2Pos: any, ballPos: any, score: any) => {
        this.players[0].x = player1Pos.x;
        this.players[0].y = player1Pos.y;
        this.players[1].x = player2Pos.x;
        this.players[1].y = player2Pos.y;
        this.ball.x = ballPos.x;
        this.ball.y = ballPos.y;
        this.players[0].goals = score.playerOneGoals;
        this.players[1].goals = score.playerTwoGoals;
      },
    );
  }
}
