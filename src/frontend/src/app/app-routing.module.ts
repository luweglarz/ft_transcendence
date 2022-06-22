import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchmakingComponent } from './pong/matchmaking/matchmaking.component';

const routes: Routes = [{ path: 'matchmaking', component: MatchmakingComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
