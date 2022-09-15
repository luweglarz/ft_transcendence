import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from 'src/db/db.module';
import { FriendsStatusGateway } from './gateway/friends-status-gateway.gateway';
import { SocialService } from './social.service';

describe('SocialService', () => {
  let service: SocialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule, HttpModule],
      providers: [SocialService, FriendsStatusGateway],
    }).compile();

    service = module.get<SocialService>(SocialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
