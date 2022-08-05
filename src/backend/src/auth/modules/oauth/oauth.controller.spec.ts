import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

describe('OauthController', () => {
  let controller: OauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthController],
      providers: [
        OauthService,
        DbService,
        JwtAuthService,
        JwtService,
        AuthUtilsService,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<OauthController>(OauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
