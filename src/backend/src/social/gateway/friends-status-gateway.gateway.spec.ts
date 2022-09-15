import { HttpModule } from '@nestjs/axios';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthModule } from 'src/auth/modules/jwt/jwt-auth.module';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';
import { SocialService } from '../social.service';
import { FriendsStatusGateway } from './friends-status-gateway.gateway';

describe('FriendsStatusGateway', () => {
  let gateway: FriendsStatusGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, JwtAuthModule, DbModule, HttpModule],
      providers: [FriendsStatusGateway, JwtAuthService, JwtService, SocialService, DbService],
    }).compile();

    gateway = module.get<FriendsStatusGateway>(FriendsStatusGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
