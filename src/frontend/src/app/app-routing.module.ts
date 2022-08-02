import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent, SignInComponent } from './auth';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './home-page/home/home.component';
import { OauthCallbackComponent } from './auth/oauth/oauth-callback.component';
import { SignOutComponent } from './auth/signout/signout.component';
import { InfoComponent } from './auth/info/info.component';

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
