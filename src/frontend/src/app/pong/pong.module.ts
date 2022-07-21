import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game/game.component';
import { GameService } from './game/game.service';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { AuthSocket } from '../class/auth-socket';

@NgModule({
  declarations: [MatchmakingComponent, GameComponent],
  imports: [CommonModule],
  providers: [GameService, MatchmakingService, GameComponent, AuthSocket],
  exports: [MatchmakingComponent],
})
export class PongModule {}
