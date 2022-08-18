export interface JwtUser {
  sub: number; // user id
  username: string;
}

export interface JwtData extends JwtUser {
  iat: number;
  exp: number;
}
