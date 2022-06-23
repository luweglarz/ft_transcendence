import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsernameSigninDto, EmailSignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: EmailSignupDto) {
    console.log(dto);
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: UsernameSigninDto) {
    // console.log(`OAUTH client ID: ${process.env['OAUTH_42_CLIENT_ID']}`);
    return this.authService.signin(dto);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout(@Body() dto: EmailSignupDto) {
    return this.authService.signout(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  check_signin() {
    return { message: 'I am signed in !' };
  }
}
