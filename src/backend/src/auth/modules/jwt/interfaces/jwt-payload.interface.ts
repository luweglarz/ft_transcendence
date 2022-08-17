import { OAuthUserDto } from '../../oauth/dto';

export interface JwtPayload {
  sub: number; // user id
  username: string;
}

export interface OAuthJwtPayload {
  oAuthUser: OAuthUserDto;
}
