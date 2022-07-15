import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-oauth2';
import { AuthService } from '../auth.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  private readonly logger = new Logger(OAuth2Strategy.name);

  // @doc http://www.passportjs.org/packages/passport-oauth2/
  constructor(private readonly authService: AuthService) {
    super(<StrategyOptions>{
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env['OAUTH_42_CLIENT_ID'],
      clientSecret: process.env['OAUTH_42_CLIENT_SECRET'],
      callbackURL: 'http://localhost:3000/oauth/redirect',
      scope: ['public'],
    });
    this.logger.debug(`OAUTH client ID: ${process.env['OAUTH_42_CLIENT_ID']}`);
    // this.logger.debug(`OAUTH SECRET: ${process.env['OAUTH_42_CLIENT_SECRET']}`);
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
    const user = this.authService.oauthFindOrCreate(accessToken);
    verified(null, user, { accessToken, refreshToken, profile });
  }
}
