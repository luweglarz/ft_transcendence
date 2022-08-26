import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { TwoFactorsService } from '../two-factors/two-factors.service';
import { AuthUtilsService } from './auth-utils.service';

describe('AuthUtilsService', () => {
  let service: AuthUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUtilsService,
        DbService,
        JwtAuthService,
        JwtService,
        TwoFactorsService,
      ],
    }).compile();

    service = module.get<AuthUtilsService>(AuthUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
