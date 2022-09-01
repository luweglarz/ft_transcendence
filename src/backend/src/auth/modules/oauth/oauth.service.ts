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
import { AuthUtilsService } from '../utils/auth-utils.service';
import { OAuthJwtPayload, OAuthSignUpDto, OAuthUserDto } from './dto';

@Injectable()
export class OauthService {
  private readonly logger = new Logger(OauthService.name);
  private readonly _tempTokenSecret = `temp ${process.env['JWT_SECRET']}`;

  constructor(
    private db: DbService,
    private jwt: JwtService,
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

  async oauthFindUser(apiUser: OAuthUserDto) {
    const authInfo = await this.db.auth.findUnique({
      where: { oauthId: apiUser.id },
      include: { user: true },
    });
    if (!authInfo) throw new ForbiddenException('Unknown user');
    else return authInfo.user;
  }

  async oauthCreateUser(dto: OAuthSignUpDto) {
    if (!(await this.verifyTempToken(dto.jwt)))
      throw new ForbiddenException('Invalid temp jwt token');
    const payload = <OAuthJwtPayload>this.jwt.decode(dto.jwt);
    const user = await this.authUtils.createUser({
      username: dto.username,
      auth: { create: { oauthId: payload.oAuthUser.id, authType: 'OAUTH42' } },
    });
    return user;
  }

  signTempToken(payload: OAuthJwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret: this._tempTokenSecret,
    });
  }
  verifyTempToken(token: string) {
    return this.jwt.verifyAsync(token, { secret: this._tempTokenSecret });
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
    for (const key of ['login', 'id', 'image_url']) {
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
