import { LocalSigninDto } from '../dto';

export type SignInData = OauthSigninData | LocalSigninData;

interface OauthSigninData {
  type: 'oauth';
  code: string;
  form: undefined;
}

interface LocalSigninData {
  type: 'local';
  form: LocalSigninDto;
}
