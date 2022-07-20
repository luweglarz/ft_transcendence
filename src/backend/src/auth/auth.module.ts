import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy, OAuth2Strategy } from './strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [JwtModule.register({}), HttpModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OAuth2Strategy],
})
export class AuthModule {}
