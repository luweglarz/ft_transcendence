import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtPayload } from '../interfaces';
import { JwtAuthService } from '../jwt-auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(service: JwtAuthService) {
    super(<StrategyOptions>{
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: service.accessTokenSecret,
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}
