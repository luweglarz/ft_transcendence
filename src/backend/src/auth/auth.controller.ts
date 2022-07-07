import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsernameSigninDto, EmailSignupDto } from './dto';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: EmailSignupDto) {
    // console.log(dto);
    this.logger.debug(`Incoming signup dto: ${JSON.stringify(dto, null, 2)}`);
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

  @UseGuards(JwtGuard)
  @Get('test')
  check_signin() {
    return { message: 'I am signed in !' };
  }
}
