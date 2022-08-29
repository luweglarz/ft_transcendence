import { Module } from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';
import { AuthenticatorController } from './authenticator.controller';
import { TwoFactorsModule } from '../two-factors/two-factors.module';
import { AuthUtilsModule } from '../utils/auth-utils.module';

@Module({
  providers: [AuthenticatorService],
  imports: [AuthUtilsModule, TwoFactorsModule],
  exports: [AuthenticatorService],
  controllers: [AuthenticatorController],
})
export class AuthenticatorModule {}
