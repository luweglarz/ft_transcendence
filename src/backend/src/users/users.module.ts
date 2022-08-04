import { Module } from '@nestjs/common';
import { UsersController } from './public/users.controller';
import { MeController } from './me/me.controller';
import { AvatarService } from './services/avatar/avatar.service';
import { UsersService } from './services/users/users.service';

@Module({
  controllers: [UsersController, MeController],
  providers: [AvatarService, UsersService],
})
export class UsersModule {}
