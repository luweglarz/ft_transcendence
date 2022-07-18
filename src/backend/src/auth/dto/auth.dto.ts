import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
// import { MatchProperty } from 'src/auth/decorator';

export class LocalSignupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(42)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  password: string;

  // @IsString()
  // @MatchProperty('password', { message: 'password does not match' })
  // passwordConfirm: string;
}

export class LocalSigninDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OAuthUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsUrl()
  image_url: string;
}
