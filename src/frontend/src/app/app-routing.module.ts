import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent, SignInComponent } from './auth';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './home-page/home.component';
import { OauthCallbackComponent } from './auth/oauth/oauth-callback.component';
import { SignOutComponent } from './auth/signout/signout.component';
import { InfoComponent } from './auth/info/info.component';
import { OtpPageComponent } from './auth/two-factors/otp-page/otp-page.component';
import { IsSignedInGuard } from './auth/jwt/guard/is-signed-in.guard';
import { MatchmakingComponent } from './pong/matchmaking/matchmaking.component';
import { GameComponent } from './pong/game/game.component';
import { IsInGameGuard } from './pong/guard/is-in-game.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [IsSignedInGuard],
    canActivateChild: [IsInGameGuard],
    children: [
      { path: '', component: MatchmakingComponent },
      { path: 'game', component: GameComponent },
    ],
  },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: '/not-found', pathMatch: 'full' },
      {
        path: 'signup',
        component: SignUpComponent,
      },
      {
        path: 'signin',
        component: SignInComponent,
      },
      {
        path: 'signout',
        component: SignOutComponent,
      },
      {
        path: 'oauth42/callback',
        component: OauthCallbackComponent,
      },
      {
        path: '2FA',
        component: OtpPageComponent,
      },
      {
        path: 'info',
        component: InfoComponent,
      },
    ],
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
