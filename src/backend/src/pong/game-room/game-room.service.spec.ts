import { Test, TestingModule } from '@nestjs/testing';
import { GameRoomService } from './game-room.service';

describe('GameRoomService', () => {
  let service: GameRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRoomService],
    }).compile();

    service = module.get<GameRoomService>(GameRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
