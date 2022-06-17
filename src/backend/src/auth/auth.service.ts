import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return { message: 'Successfully signed up!' };
  }
  signin() {
    return { message: 'Successfully signed in!' };
  }
  signout() {
    return { message: 'Successfully signed out!' };
  }
}
