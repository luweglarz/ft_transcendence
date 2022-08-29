import { JwtTokens } from '../../jwt/dto/tokens.dto';

/*
 * @brief received data on successful sign-in
 */
export interface SignInSuccessDto {
  message: string;
  status: 'complete';
  tokens: JwtTokens;
}
