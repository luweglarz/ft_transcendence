import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-oauth2';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  private readonly logger = new Logger(OAuth2Strategy.name);

  // @doc http://www.passportjs.org/packages/passport-oauth2/
  constructor() {
    super(<StrategyOptions>{
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env['OAUTH_42_CLIENT_ID'],
      clientSecret: process.env['OAUTH_42_CLIENT_SECRET'],
      callbackURL: 'http://localhost:3000/oauth/redirect',
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    verified: VerifyCallback,
  ) {
    this.logger.debug(`${OAuth2Strategy.name}.${this.validate.name} called`);
    this.logger.debug(`accessToken: ${accessToken}`);
    this.logger.debug(`refreshToken: ${refreshToken}`);
    this.logger.debug(`profile: ${JSON.stringify(profile, null, 2)}`); // empty
    verified(null, profile);
  }
}
