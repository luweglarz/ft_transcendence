import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy, JwtRefreshStrategy } from './strategy';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthController } from './jwt-auth.controller';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtAccessStrategy, JwtRefreshStrategy, JwtAuthService],
  exports: [JwtAuthService],
  controllers: [JwtAuthController],
})
export class JwtAuthModule {}
