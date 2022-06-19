import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { DbClientService } from 'src/db-client/db-client.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private dbClient: DbClientService) {}

  async signup(dto: AuthDto) {
    const pwdHash = await hash(dto.password);
    await this.dbClient.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: dto.password,
      },
    });
    return { message: `${dto.username} successfully signed up! ${pwdHash}` };
  }
  signin(dto: AuthDto) {
    return { message: `${dto.username} Successfully signed in!` };
  }
  signout(dto: AuthDto) {
    return { message: `${dto.username} Successfully signed out!` };
  }
}
