import { Module } from '@nestjs/common';
import { LocalAuthService } from './local-auth.service';
import { LocalAuthController } from './local-auth.controller';
import { AuthUtilsModule } from '../utils/auth-utils.module';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [LocalAuthService],
  controllers: [LocalAuthController],
  imports: [AuthUtilsModule, DbModule],
})
export class LocalAuthModule {}
