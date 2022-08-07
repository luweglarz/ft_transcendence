import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';

describe('LocalAuthController', () => {
  let controller: LocalAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalAuthController],
      providers: [
        LocalAuthService,
        DbService,
        AuthUtilsService,
        JwtAuthService,
        JwtService,
      ],
    }).compile();

    controller = module.get<LocalAuthController>(LocalAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
