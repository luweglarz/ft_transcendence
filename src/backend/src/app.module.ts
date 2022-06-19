import { Module } from '@nestjs/common';
import { PongModule } from './pong/pong.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DbModule, PongModule, AuthModule],
  // controllers: [AppController], // TODO: should probably remove those
  // providers: [AppService],
})
export class AppModule {}
