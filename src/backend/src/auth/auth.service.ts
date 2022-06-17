import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  signup(dto: AuthDto) {
    return { message: `${dto.username} successfully signed up!` };
  }
  signin(dto: AuthDto) {
    return { message: `${dto.username} Successfully signed in!` };
  }
  signout(dto: AuthDto) {
    return { message: `${dto.username} Successfully signed out!` };
  }
}
