import { Module, Scope } from '@nestjs/common';
import { PongModule } from './pong/pong.module';
import { ChatModule } from './chat/chat.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { UsersModule } from './users/users.module';
import { SocialModule } from './social/social.module';
import { DirectMessagesModule } from './direct-message/direct-messages.module';

@Module({
  imports: [
    DbModule,
    PongModule,
    AuthModule,
    ChatModule,
    UsersModule,
    SocialModule,
    DirectMessagesModule,
  ],
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
