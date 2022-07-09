import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { DbErrorCode } from 'src/db/errors';
import { DbService } from 'src/db/db.service';
import { UsernameSigninDto, EmailSignupDto, OAuthUserDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { validate } from 'class-validator';
import { JwtPayload, SignupUser } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private db: DbService,
    private jwt: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async localSignup(dto: EmailSignupDto) {
    const pwdHash = await argon.hash(dto.password);
    await this.createUser({
      username: dto.username,
      email: dto.email,
      password: pwdHash,
    });
    return { message: `${dto.username} successfully signed up!` };
  }

  private async createUser(data: SignupUser) {
    try {
      const user = await this.db.user.create({ data: data });
      this.logger.log(`New user '${data.username}' successfully signed up!`);
      return user;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code == DbErrorCode.UniqueConstraintFailed
      )
        throw new ForbiddenException('User already exists');
      else throw err;
    }
  }

  async signin(dto: UsernameSigninDto) {
    const user = await this.db.user.findUnique({
      where: { username: dto.username },
    });
    if (user && (await argon.verify(user.password, dto.password))) {
      this.logger.log(`User '${dto.username}' successfully signed in!`);
      return {
        message: `${user.username} successfully signed in!`,
        jwt: await this.signToken({ sub: user.id, username: user.username }),
      };
    } else throw new ForbiddenException('Credentials incorrect');
  }

  signout(dto: EmailSignupDto) {
    // TODO
    return { message: `${dto.username} Successfully signed out!` };
  }

  private signToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '42m',
      secret: process.env['JWT_SECRET'],
    });
  }

  private async fetch42APIUserData(accessToken: string) {
    const userObservable = this.httpService.get(
      'https://api.intra.42.fr/v2/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    const { data } = await lastValueFrom(userObservable);
    if (!data)
      throw new ForbiddenException('Could not fetch user with 42 OAuth2 API');
    const user = new OAuthUserDto();
    for (const key of [
      'login',
      'email',
      'first_name',
      'last_name',
      'image_url',
    ]) {
      user[key] = data[key];
    }
    const errors = await validate(user, {
      whitelist: true,
    });
    if (errors.length > 0)
      throw new BadRequestException(
        `42's API sent incorrect data: ${errors[0]}`,
      );
    return user;
  }

  async oauthFindOrCreate(accessToken: string) {
    const apiUser = await this.fetch42APIUserData(accessToken);
    let user = await this.db.user.findUnique({
      where: {
        username: apiUser.login,
      },
    });
    if (!user) {
      user = await this.createUser({
        username: apiUser.login,
        email: apiUser.email,
      });
    }
    return user;
  }
}
