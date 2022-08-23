import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtData, JwtUser } from '../dto';
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
  validate(payload: JwtData) {
    // TODO: we may want to check in the database that the user still exists
    // (if db is erased, the token remains valid even though the user does not exist anymore)
    const user: JwtUser = { sub: payload.sub, username: payload.username };
    return user;
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
  validate(payload: JwtData) {
    const user: JwtUser = { sub: payload.sub, username: payload.username };
    return user;
  }
}
