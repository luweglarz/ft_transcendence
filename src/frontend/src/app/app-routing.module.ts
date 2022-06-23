import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './pong/game/game.component';
import { IsInGameGuard } from './pong/game/is-in-game.guard';
import { MatchmakingComponent } from './pong/matchmaking/matchmaking.component';

const routes: Routes = [
  { path: 'matchmaking', component: MatchmakingComponent },
  { path: 'game', component: GameComponent, canActivate: [IsInGameGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
