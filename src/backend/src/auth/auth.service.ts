import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  async signup(dto: AuthDto) {
    const pwdHash = await hash(dto.password);
    return { message: `${dto.username} successfully signed up! ${pwdHash}` };
  }
  signin(dto: AuthDto) {
    return { message: `${dto.username} Successfully signed in!` };
  }
  signout(dto: AuthDto) {
    return { message: `${dto.username} Successfully signed out!` };
  }
}
