import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-oauth2';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  private readonly logger = new Logger(OAuth2Strategy.name);

  // @doc http://www.passportjs.org/packages/passport-oauth2/
  constructor(private readonly httpService: HttpService) {
    super(<StrategyOptions>{
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env['OAUTH_42_CLIENT_ID'],
      clientSecret: process.env['OAUTH_42_CLIENT_SECRET'],
      callbackURL: 'http://localhost:3000/oauth/redirect',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any, // empty object
    verified: VerifyCallback,
  ) {
    this.logger.debug(`${OAuth2Strategy.name}.${this.validate.name} called`);
    this.logger.debug(`accessToken: ${accessToken}`);
    this.logger.debug(`refreshToken: ${refreshToken}`);
    const userObservable = this.httpService.get(
      'https://api.intra.42.fr/v2/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    const { data } = await lastValueFrom(userObservable); // lastValueFrom: convert observable to promise
    // this.logger.debug(`data: ${JSON.stringify(data, null, 2)}`); // user format: https://api.intra.42.fr/apidoc/2.0/users/me.html
    const user = { email: data.email, login: data.login };
    verified(null, user, { accessToken, refreshToken, profile });
  }
}
