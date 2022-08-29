import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { TwoFactorsService } from '../two-factors/two-factors.service';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { LocalAuthService } from './local-auth.service';

describe('LocalAuthService', () => {
  let service: LocalAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalAuthService,
        DbService,
        AuthUtilsService,
        TwoFactorsService,
        JwtAuthService,
        JwtService,
      ],
    }).compile();

    service = module.get<LocalAuthService>(LocalAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
