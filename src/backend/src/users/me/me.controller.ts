import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User, JwtAccessGuard } from 'src/auth';
import { JwtUser } from 'src/auth/modules/jwt/dto';
import { AvatarService } from '../services/avatar/avatar.service';

@Controller('me')
@UseGuards(JwtAccessGuard)
export class MeController {
  constructor(private avatar: AvatarService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  editAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/,
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1000 * 1000, // 10Mb
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    avatar: Express.Multer.File,
    @User() user: JwtUser,
  ) {
    this.avatar.uploadAvatar(user, avatar.buffer);
  }
}
