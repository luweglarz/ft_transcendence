import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import * as argon from 'argon2';
import { DbService } from 'src/db/db.service';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { LocalSignupDto, LocalSigninDto } from './dto';

@Injectable()
export class LocalAuthService {
  private readonly logger = new Logger(LocalAuthService.name);
  constructor(private db: DbService, private auth: AuthUtilsService) {}

  /*
   * @brief sign up with email and password
   */
  async localSignUp(dto: LocalSignupDto) {
    const pwdHash = await argon.hash(dto.password);
    const user = await this.auth.createUser({
      username: dto.username,
      auth: {
        create: {
          email: dto.email,
          password: pwdHash,
        },
      },
    });
    this.logger.log(`User '${user.username}' successfully signed up!`);
    return this.auth.signInSuccess(user);
  }

  /*
   * @brief sign in with email and password
   */
  async localSignIn(dto: LocalSigninDto) {
    const user = await this.db.user.findUnique({
      where: { username: dto.username },
      include: { auth: true },
    });
    if (user && user.auth.authType != 'LOCAL')
      throw new ForbiddenException(
        'Local authentication not set up for the current user',
      );
    else if (user && (await argon.verify(user.auth.password, dto.password))) {
      return this.auth.signInSuccess(user);
    } else throw new ForbiddenException('Credentials incorrect');
  }
}
