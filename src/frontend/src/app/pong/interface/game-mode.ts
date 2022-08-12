import { Socket } from 'ngx-socket-io';
import { Ball } from '../class/ball';
import { Player } from '../class/player';

export interface GameMode {
  get canvaHeight(): number;
  get canvaWidth(): number;
  get backgroundColor(): string;
  get players(): Player[];
  get ball(): Ball;

  onGameUpdate(socket: Socket): void;
}
