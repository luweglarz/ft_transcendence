import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

export const authConfig: AuthConfig = {
  issuer: 'https://api.intra.42.fr/oauth/authorize?client_id=0965984ac1e7cf033c88f529c45f4d6b6b4be9ff98c53e89f5f53935834422c1&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F&response_type=code',
  redirectUri: 'http://localhost:4200/',
  clientId: environment.apiUid,
  scope: 'openid profile email voucher',
}
