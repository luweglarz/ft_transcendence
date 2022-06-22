import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { GameComponent } from './game/game.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [MatchmakingComponent, GameComponent],
  imports: [CommonModule, SocketIoModule.forRoot(config)],
})
export class PongModule {}
