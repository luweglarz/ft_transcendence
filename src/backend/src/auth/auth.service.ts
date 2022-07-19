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
import {
  LocalSigninDto,
  LocalSignupDto,
  OAuthSignUpDto,
  OAuthUserDto,
} from './dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { validate } from 'class-validator';
import { JwtPayload, OAuthJwtPayload } from './interfaces';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private db: DbService,
    private jwt: JwtService,
    private readonly httpService: HttpService,
  ) {}

  //  ============================ PUBLIC Methods ============================  //

  /*
   * @brief sign up with email and password
   */
  async localSignUp(dto: LocalSignupDto) {
    const pwdHash = await argon.hash(dto.password);
    const user = await this.createUser({
      username: dto.username,
      email: dto.email,
      password: pwdHash,
    });
    this.logger.log(`User '${user.username}' successfully signed up!`);
    return this.signInSuccess(user);
  }

  /*
   * @brief sign in with email and password
   */
  async localSignIn(dto: LocalSigninDto) {
    const user = await this.db.user.findUnique({
      where: { username: dto.username },
    });
    if (user && (await argon.verify(user.password, dto.password))) {
      return this.signInSuccess(user);
    } else throw new ForbiddenException('Credentials incorrect');
  }

  /*
   * @brief Return a signed token. To be called after the sign in checks were successful
   */
  async signInSuccess(user: User) {
    this.logger.log(`User '${user.username}' successfully signed in!`);
    return {
      message: `${user.username} successfully signed in!`,
      jwt: await this.signToken(<JwtPayload>{
        sub: user.id,
        username: user.username,
      }),
    };
  }

  async oauthSignUpTempToken(user: OAuthUserDto) {
    return {
      jwt: await this.signToken(<OAuthJwtPayload>{
        state: 'incomplete',
        oAuthUser: user,
      }),
    };
  }

  signOut() {
    // TODO
    return { message: 'Successfully signed out!' };
  }

  async oauthFindUser(apiUser: OAuthUserDto) {
    const user = await this.db.user.findUnique({
      where: { email: apiUser.email },
    });
    if (!user) throw new ForbiddenException('Unknown user');
    else return user;
  }

  async oauthCreateUser(dto: OAuthSignUpDto) {
    if (
      !(await this.jwt.verifyAsync(dto.jwt, {
        secret: process.env['JWT_SECRET'],
      }))
    )
      throw new ForbiddenException('Invalid temp jwt token');
    const payload = <OAuthJwtPayload>this.jwt.decode(dto.jwt);
    const user = await this.createUser({
      username: dto.username,
      email: payload.oAuthUser.email,
      authType: 'OAUTH42',
    });
    return user;
  }

  async fetch42APIUserData(accessToken: string) {
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
      'image_url',
      // 'first_name',
      // 'last_name',
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

  //  =========================== PRIVATE Methods ============================  //

  private async createUser(data: Prisma.UserCreateInput) {
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

  private signToken(payload: JwtPayload | OAuthJwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '42m',
      secret: process.env['JWT_SECRET'],
    });
  }
}
