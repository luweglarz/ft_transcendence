import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { GameComponent } from './game/game.component';
import { GameService } from './game/game.service';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [MatchmakingComponent, GameComponent],
  imports: [CommonModule, SocketIoModule.forRoot(config)],
  providers: [GameService, MatchmakingService, GameComponent],
  exports: [MatchmakingComponent],
})
export class PongModule {}
