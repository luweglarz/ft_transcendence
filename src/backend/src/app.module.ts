import { Module, Scope } from '@nestjs/common';
import { PongModule } from './pong/pong.module';
import { ChatModule } from './chat/chat.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [DbModule, PongModule, AuthModule, ChatModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor,
    },
  ],
  // controllers: [AppController], // TODO: should probably remove those
  // providers: [AppService],
})
export class AppModule {}
