import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';
import { lastValueFrom } from 'rxjs';
import { DbService } from 'src/db/db.service';
import { OAuthJwtPayload } from '../jwt/interfaces';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { OAuthSignUpDto, OAuthUserDto } from './dto';

@Injectable()
export class OauthService {
  private readonly logger = new Logger(OauthService.name);
  constructor(
    private db: DbService,
    private jwt: JwtService,
    private jwtAuth: JwtAuthService,
    private readonly httpService: HttpService,
    private authUtils: AuthUtilsService,
  ) {}
  async oauthSignUp(dto: OAuthSignUpDto) {
    const user = await this.oauthCreateUser(dto);
    return this.authUtils.signInSuccess(user);
  }

  async oauthSignIn(oauthUser: OAuthUserDto) {
    const user = await this.oauthFindUser(oauthUser);
    this.logger.debug(`Sign in user: ${user.username}`);
    return this.authUtils.signInSuccess(user);
  }

  async oauthSignUpTempToken(user: OAuthUserDto) {
    return {
      jwt: await this.jwtAuth.signToken(<OAuthJwtPayload>{
        state: 'incomplete',
        oAuthUser: user,
      }),
    };
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
    const user = await this.authUtils.createUser({
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
    for (const key of ['login', 'email', 'image_url']) {
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
}
