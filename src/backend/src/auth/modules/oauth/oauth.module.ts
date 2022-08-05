import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { AuthUtilsModule } from '../utils/auth-utils.module';
import { DbModule } from 'src/db/db.module';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { OAuth2Strategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [OauthService, OAuth2Strategy],
  controllers: [OauthController],
  imports: [AuthUtilsModule, DbModule, HttpModule, JwtAuthModule, JwtModule],
})
export class OauthModule {}
