import { ForbiddenException, Injectable } from '@nestjs/common';
import { verify, hash } from 'argon2';
import { DbService } from 'src/db/db.service';
import { UsernameSigninDto, EmailSignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private db: DbService) {}

  async signup(dto: EmailSignupDto) {
    const pwdHash = await hash(dto.password);
    await this.db.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: pwdHash,
      },
    });
    return { message: `${dto.username} successfully signed up! ${pwdHash}` };
  }

  async signin(dto: UsernameSigninDto) {
    const user = await this.db.user.findUnique({
      where: { username: dto.username },
    });
    if (user && (await verify(user.password, dto.password))) {
      return { message: `${user.username} Successfully signed in!` };
    } else throw new ForbiddenException({ message: 'Credentials incorrect' });
  }

  signout(dto: EmailSignupDto) {
    return { message: `${dto.username} Successfully signed out!` };
  }
}
