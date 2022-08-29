import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { TwoFactorsService } from '../two-factors/two-factors.service';
import { AuthUtilsController } from './auth-utils.controller';
import { AuthUtilsService } from './auth-utils.service';

describe('AuthUtilsController', () => {
  let controller: AuthUtilsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthUtilsController],
      providers: [
        AuthUtilsService,
        DbService,
        JwtAuthService,
        JwtService,
        TwoFactorsService,
      ],
    }).compile();

    controller = module.get<AuthUtilsController>(AuthUtilsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
