import { Global, Module } from '@nestjs/common';
import { DbClientService } from './db-client.service';

@Global()
@Module({
  providers: [DbClientService],
  exports: [DbClientService],
})
export class DbClientModule {}
