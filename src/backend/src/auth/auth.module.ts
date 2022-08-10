import { Module } from '@nestjs/common';
import { LocalAuthModule } from './modules/local/local-auth.module';
import { RouterModule } from '@nestjs/core';
import { routes } from './routes';
import { AuthUtilsModule } from './modules/utils/auth-utils.module';
import { JwtAuthModule } from './modules/jwt/jwt-auth.module';
import { OauthModule } from './modules/oauth/oauth.module';

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
