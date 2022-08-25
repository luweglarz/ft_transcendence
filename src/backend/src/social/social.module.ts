import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  imports: [HttpModule],
  providers: [SocialService, DbService],
  controllers: [SocialController],
})
export class SocialModule {}
