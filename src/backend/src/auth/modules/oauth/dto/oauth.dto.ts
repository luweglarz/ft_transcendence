import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

/*
 * @brief Partial user infos fetched with 42's API
 */
export class OAuthUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUrl()
  image_url: string;
}

/*
 * @brief Data sent in signup in OAuth mode
 */
export class OAuthSignUpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  username: string;

  @IsString()
  jwt: string;
}

/*
 * @brief Data stored in the temp jwt on oauth signup
 */
export interface OAuthJwtPayload {
  oAuthUser: OAuthUserDto;
}
