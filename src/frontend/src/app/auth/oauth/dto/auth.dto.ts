export interface OAuthUserDto {
  login: string;
  id: number;
  image_url: string;
}

// TODO: use it in signup.service.ts
// export interface OAuthSignUpDto {
//   username: string;
//   jwt: string;
// }

export interface OAuthJwtPayload {
  oAuthUser: OAuthUserDto;
}
