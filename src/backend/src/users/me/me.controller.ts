import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User, JwtAccessGuard } from 'src/auth';
import { JwtPayload } from 'src/auth/modules/jwt/interfaces';
import { AvatarService } from '../services/avatar/avatar.service';

@Controller('me')
@UseGuards(JwtAccessGuard)
export class MeController {
  constructor(private avatar: AvatarService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  editAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @User() user: JwtPayload,
  ) {
    this.avatar.uploadAvatar(user, avatar.buffer);
  }
}
