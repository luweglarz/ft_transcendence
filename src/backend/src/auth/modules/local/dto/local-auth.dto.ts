import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LocalSignupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  @IsAlphanumeric()
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(42)
  password: string;
}

export class LocalSigninDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
