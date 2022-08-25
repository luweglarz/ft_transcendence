import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TwoFactorsController } from './two-factors.controller';
import { TwoFactorsService } from './two-factors.service';

@Module({
  controllers: [TwoFactorsController],
  providers: [TwoFactorsService],
  imports: [JwtModule],
  exports: [TwoFactorsService],
})
export class TwoFactorsModule {}
