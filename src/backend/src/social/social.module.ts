import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { DbModule } from 'src/db/db.module';
import { PongModule } from 'src/pong/pong.module';
import { FriendsStatusGateway } from './gateway/friends-status-gateway.gateway';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  imports: [HttpModule, JwtModule, DbModule, forwardRef(() => PongModule)],
  exports: [FriendsStatusGateway],
  providers: [SocialService, FriendsStatusGateway, JwtAuthService],
  controllers: [SocialController],
})
export class SocialModule {}
