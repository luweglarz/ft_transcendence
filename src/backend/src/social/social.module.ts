import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { DbService } from 'src/db/db.service';
import { PongModule } from 'src/pong/pong.module';
import { FriendsStatusGateway } from './gateway/friends-status-gateway.gateway';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  imports: [HttpModule, PongModule],
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
