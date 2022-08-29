import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { AuthUtilsModule } from '../utils/auth-utils.module';
import { DbModule } from 'src/db/db.module';
import { HttpModule } from '@nestjs/axios';
import { OAuth2Strategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { TwoFactorsModule } from '../two-factors/two-factors.module';

@Module({
  providers: [OauthService, OAuth2Strategy],
  controllers: [OauthController],
  imports: [AuthUtilsModule, DbModule, HttpModule, JwtModule, TwoFactorsModule],
})
export class OauthModule {}
