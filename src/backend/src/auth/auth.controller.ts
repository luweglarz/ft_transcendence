import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  LocalSigninDto,
  LocalSignupDto,
  OAuthSignUpDto,
  OAuthUserDto,
} from './dto';
import { JwtGuard, OAuth2Guard } from './guard';
import { JwtPayload } from './interfaces';

@Controller('auth')
export class AuthController {
  private readonly client_id = process.env['OAUTH_42_CLIENT_ID'];

  constructor(private service: AuthService) {}

  @Post('local/signup')
  localSignUp(@Body() dto: LocalSignupDto) {
    return this.service.localSignUp(dto);
  }

  @Post('local/signin')
  async localSignIn(@Body() dto: LocalSigninDto) {
    return this.service.localSignIn(dto);
  }

  @Post('oauth42/signin')
  @UseGuards(OAuth2Guard)
  async oauthSignIn(@Req() req: Request) {
    return this.service.oauthSignIn(<OAuthUserDto>req.user);
  }

  @Get('oauth42/signup-temp-token')
  @UseGuards(OAuth2Guard)
  async oauthSignUpTempToken(@Req() req: Request) {
    return this.service.oauthSignUpTempToken(<OAuthUserDto>req.user);
  }

  @Post('oauth42/signup')
  async oauthSignUp(@Body() dto: OAuthSignUpDto) {
    return this.service.oauthSignUp(dto);
  }

  @Get('oauth42/client_id')
  getOAuthClientId() {
    return { client_id: this.client_id };
  }

  @Post('upload/avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  editAvatar(@UploadedFile() avatar: Express.Multer.File, @Req() req: Request) {
    this.service.uploadAvatar(<JwtPayload>req.user, avatar.buffer);
  }

  @Get('download/avatar')
  @UseGuards(JwtGuard)
  async downloadAvatar(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const image = await this.service.getAvatar(<JwtPayload>req.user);
    res.set({
      'Content-Disposition': `inline; filename="avatar.jpg"`,
      'Content-Type': 'image/jpg',
    });
    if (image) {
      return new StreamableFile(image);
    } else return '';
  }

  //  ============================ Testing routes ============================  //

  @UseGuards(JwtGuard)
  @Get('private')
  isSignedIn() {
    return { message: 'Private connection established! 👍' };
  }

  @Get('public')
  testPublicRoute() {
    return { message: 'Hello, this is a public route!' };
  }
}
