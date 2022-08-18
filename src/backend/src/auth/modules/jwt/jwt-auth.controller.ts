import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { JwtRefreshGuard } from './guard';
import { JwtPayload } from './interfaces';
import { JwtAuthService } from './jwt-auth.service';

@Controller()
export class JwtAuthController {
  constructor(private service: JwtAuthService) {}

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  refreshToken(@User() user: JwtPayload) {
    return this.service.newTokens(user);
  }
}
