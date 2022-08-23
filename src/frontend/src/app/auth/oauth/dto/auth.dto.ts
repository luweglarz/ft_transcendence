export interface OAuthUserDto {
  login: string;
  email: string;
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
