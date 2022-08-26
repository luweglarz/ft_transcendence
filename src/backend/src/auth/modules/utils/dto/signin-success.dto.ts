import { JwtTokens } from '../../jwt/dto/tokens.dto';

// @brief sent when sign-in successful
export interface SignInSuccessDto {
  message: string;
  status: 'complete';
  tokens: JwtTokens;
}
