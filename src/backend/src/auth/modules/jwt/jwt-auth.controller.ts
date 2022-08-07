import { Controller, Post } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';

@Controller()
export class JwtAuthController {
  constructor(private service: JwtAuthService) {}

  @Post('refresh')
  refreshToken() {
    return this.service.refreshToken();
  }
}
