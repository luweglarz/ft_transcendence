import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { TwoFactorsService } from '../two-factors/two-factors.service';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { AuthenticatorController } from './authenticator.controller';
import { AuthenticatorService } from './authenticator.service';

describe('AuthenticatorController', () => {
  let controller: AuthenticatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticatorController],
      providers: [
        AuthenticatorService,
        DbService,
        JwtAuthService,
        JwtService,
        AuthUtilsService,
        TwoFactorsService,
      ],
    }).compile();

    controller = module.get<AuthenticatorController>(AuthenticatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
