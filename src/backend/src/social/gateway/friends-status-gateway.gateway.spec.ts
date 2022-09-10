import { Test, TestingModule } from '@nestjs/testing';
import { FriendsStatusGatewayGateway } from './friends-status-gateway.gateway';

describe('FriendsStatusGatewayGateway', () => {
  let gateway: FriendsStatusGatewayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendsStatusGatewayGateway],
    }).compile();

    gateway = module.get<FriendsStatusGatewayGateway>(
      FriendsStatusGatewayGateway,
    );
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
