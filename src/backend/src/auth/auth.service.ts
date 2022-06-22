import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { DbService } from 'src/db/db.service';
import { UsernameSigninDto, EmailSignupDto } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private db: DbService, private jwt: JwtService) {}

  async signup(dto: EmailSignupDto) {
    const pwdHash = await argon.hash(dto.password);
    await this.db.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: pwdHash,
      },
    });
    this.logger.log(`New user '${dto.username}' successfully signed up!`);
    return { message: `${dto.username} successfully signed up!` };
  }

  async signin(dto: UsernameSigninDto) {
    const user = await this.db.user.findUnique({
      where: { username: dto.username },
    });
    if (user && (await argon.verify(user.password, dto.password))) {
      this.logger.log(`User '${dto.username}' successfully signed in!`);
      // return { message: `${user.username} successfully signed in!` };
      return { jwt: await this.signToken(user.id, user.username) };
    } else throw new ForbiddenException({ message: 'Credentials incorrect' });
  }

  signout(dto: EmailSignupDto) {
    return { message: `${dto.username} Successfully signed out!` };
  }

  signToken(userId: number, username: string): Promise<string> {
    const payload = {
      sub: userId,
      username: username,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '42m',
      secret: process.env['JWT_SECRET'],
    });
  }
}
