import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { DbModule } from 'src/db/db.module';
import { SocialService } from '../social.service';
import { FriendsStatusGateway } from './friends-status-gateway.gateway';

describe('FriendsStatusGateway', () => {
  let gateway: FriendsStatusGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, DbModule, HttpModule],
      providers: [FriendsStatusGateway, JwtAuthService, SocialService],
    }).compile();

    gateway = module.get<FriendsStatusGateway>(FriendsStatusGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
