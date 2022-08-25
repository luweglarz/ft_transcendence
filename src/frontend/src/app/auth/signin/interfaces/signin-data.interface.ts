import { LocalSigninDto, OauthSigninDto } from '../dto';

export type SignInData = OauthSigninData | LocalSigninData;

interface OauthSigninData {
  type: 'oauth';
  code: string;
  form: OauthSigninDto;
}

interface LocalSigninData {
  type: 'local';
  form: LocalSigninDto;
}
