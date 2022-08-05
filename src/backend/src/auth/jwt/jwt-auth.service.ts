import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, OAuthJwtPayload } from './interfaces';

@Injectable()
export class JwtAuthService {
  constructor(private jwt: JwtService) {}

  signToken(payload: JwtPayload | OAuthJwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '42m',
      secret: process.env['JWT_SECRET'],
    });
  }
}
