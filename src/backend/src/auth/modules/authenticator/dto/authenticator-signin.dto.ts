import { IsString } from 'class-validator';

export class AuthenticatorSigninDto {
  @IsString()
  partialToken: string;
  @IsString()
  otp: string;
}
