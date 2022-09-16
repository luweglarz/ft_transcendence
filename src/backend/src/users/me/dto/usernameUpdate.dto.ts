import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class UsernameUpdateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  @IsAlphanumeric()
  username: string;
}
