import { Module } from '@nestjs/common';
import { LocalAuthModule } from './local/local-auth.module';
import { RouterModule } from '@nestjs/core';
import { routes } from './routes';
import { AuthUtilsModule } from './utils/auth-utils.module';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    RouterModule.register(routes),
    LocalAuthModule,
    JwtAuthModule,
    AuthUtilsModule,
    OauthModule,
  ],
})
export class AuthModule {}
