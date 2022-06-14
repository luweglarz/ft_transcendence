import { Module } from '@nestjs/common';
import { PongModule } from './pong/pong.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { DbClientModule } from './db-client/db-client.module';

@Module({
  imports: [DbClientModule, PongModule],
  // controllers: [AppController], // TODO: should probably remove those
  // providers: [AppService],
})
export class AppModule {}
