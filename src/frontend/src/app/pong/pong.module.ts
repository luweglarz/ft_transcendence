import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game/game.component';
import { GameService } from './game/game.service';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { GameSocket } from './class/game-socket';
import { NotificationService } from '../home-page/services/notification.service';

@NgModule({
  declarations: [MatchmakingComponent, GameComponent],
  imports: [CommonModule],
  providers: [GameService, MatchmakingService, GameComponent, GameSocket],
  exports: [MatchmakingComponent, GameComponent],
})
export class PongModule {}
