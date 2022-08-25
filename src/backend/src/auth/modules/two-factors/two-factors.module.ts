import { Module } from '@nestjs/common';
import { TwoFactorsController } from './two-factors.controller';
import { TwoFactorsService } from './two-factors.service';

@Module({
  controllers: [TwoFactorsController],
  providers: [TwoFactorsService],
  exports: [TwoFactorsService],
})
export class TwoFactorsModule {}
