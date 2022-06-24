import { Test, TestingModule } from '@nestjs/testing';
import { RoomUserService } from './room-user.service';

describe('RoomUserService', () => {
  let service: RoomUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomUserService],
    }).compile();

    service = module.get<RoomUserService>(RoomUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
