import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { DbService } from 'src/db/db.service';
import { FriendsStatusGateway } from './gateway/friends-status-gateway.gateway';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  imports: [HttpModule],
  providers: [
    SocialService,
    DbService,
    JwtAuthService,
    JwtService,
    FriendsStatusGateway,
  ],
  controllers: [SocialController],
})
export class SocialModule {}
