import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { TwoFactorsService } from '../two-factors/two-factors.service';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { AuthenticatorService } from './authenticator.service';

describe('AuthenticatorService', () => {
  let service: AuthenticatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticatorService,
        DbService,
        JwtAuthService,
        JwtService,
        AuthUtilsService,
        TwoFactorsService,
      ],
    }).compile();

    service = module.get<AuthenticatorService>(AuthenticatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
