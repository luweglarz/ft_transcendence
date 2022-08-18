export interface JwtPayload {
  sub: number; // user id
  username: string;
}

export interface JwtData extends JwtPayload {
  iat: number;
  exp: number;
}
