export interface OAuthUser {
  login: string;
  email: string;
  image_url: string;
}

export interface OAuthJwtPayload {
  state: 'incomplete';
  oAuthUser: OAuthUser;
}
