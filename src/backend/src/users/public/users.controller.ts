import {
  Controller,
  Get,
  Param,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { AvatarService } from '../services/avatar/avatar.service';

@Controller('users/:username')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private avatar: AvatarService) {}

  @Get('avatar')
  async downloadAvatar(
    @Param('username') username: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const avatar = await this.avatar.getAvatar(username);
    if (avatar) {
      res.set({
        'Content-Disposition': `inline; filename="avatar.jpg"`,
        'Content-Type': avatar.mimeType,
      });
      return new StreamableFile(avatar.image);
    } else return '';
  }
}
