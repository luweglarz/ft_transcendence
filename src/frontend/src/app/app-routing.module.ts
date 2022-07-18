import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent, SignInComponent } from './auth';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { GameComponent } from './pong/game/game.component';
import { IsInGameGuard } from './pong/game/is-in-game.guard';
import { OauthComponent } from './auth/oauth/oauth.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: '/not-found', pathMatch: 'full' },
      {
        path: 'signin',
        component: SignInComponent,
      },
      {
        path: 'signup',
        component: SignUpComponent,
      },
      {
        path: 'oauth42/callback',
        component: OauthComponent,
      },
    ],
  },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [IsInGameGuard],
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
