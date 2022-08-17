import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtPayload } from '../interfaces';
import { JwtAuthService } from '../jwt-auth.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(service: JwtAuthService) {
    super(<StrategyOptions>{
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: service.accessTokenSecret,
    });
  }
  validate(payload: JwtPayload) {
    // TODO: we may want to check in the database that the user still exists
    // (if db is erased, the token remains valid even though the user does not exist anymore)
    return payload;
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(service: JwtAuthService) {
    super(<StrategyOptions>{
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: service.refreshTokenSecret,
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}
