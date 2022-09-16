import {
  Body,
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
import { UsersService } from '../services/users/users.service';
import { UsernameUpdateDto } from './dto/usernameUpdate.dto';

@Controller('me')
@UseGuards(JwtAccessGuard)
export class MeController {
  constructor(
    private avatar: AvatarService,
    private usersService: UsersService,
  ) {}

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

  @Post('avatar-clear')
  clearAvatar(@User() user: JwtUser) {
    this.avatar.clearAvatar(user);
  }

  @Post('username/update')
  updateUsername(@User() user: JwtUser, @Body() dto: UsernameUpdateDto) {
    this.usersService.updateUsername(user, dto.username);
  }
}
