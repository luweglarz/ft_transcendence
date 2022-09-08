import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
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

  @IsNumber()
  id: number;

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
  @IsAlphanumeric()
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
