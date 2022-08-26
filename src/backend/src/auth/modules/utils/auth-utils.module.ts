import { Module } from '@nestjs/common';
import { AuthUtilsService } from './auth-utils.service';
import { AuthUtilsController } from './auth-utils.controller';
import { HttpModule } from '@nestjs/axios';
import { DbModule } from 'src/db/db.module';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { TwoFactorsModule } from '../two-factors/two-factors.module';

@Module({
  providers: [AuthUtilsService],
  controllers: [AuthUtilsController],
  imports: [HttpModule, DbModule, JwtAuthModule, TwoFactorsModule],
  exports: [AuthUtilsService],
})
export class AuthUtilsModule {}
