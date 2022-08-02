import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import WildcardsIoAdapter from './pong/adapter/wildcardSocketioAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:4200'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      preflightContinue: false,
      credentials: true,
      allowedHeaders: ['content-type', 'authorization'],
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useWebSocketAdapter(new WildcardsIoAdapter(app));
  await app.listen(3000);
}
bootstrap();
