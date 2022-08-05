import { Routes } from '@nestjs/core';
import { LocalAuthModule } from './local/local-auth.module';
import { OauthModule } from './oauth/oauth.module';
import { AuthUtilsModule } from './utils/auth-utils.module';

export const routes: Routes = [
  {
    path: 'auth',
    module: AuthUtilsModule,
    children: [
      { path: 'local', module: LocalAuthModule },
      { path: 'oauth42', module: OauthModule },
    ],
  },
];
