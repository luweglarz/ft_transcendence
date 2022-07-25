import { Test, TestingModule } from '@nestjs/testing';
import { GameCoreService } from './game-core.service';

describe('GameCoreService', () => {
  let service: GameCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameCoreService],
    }).compile();

    service = module.get<GameCoreService>(GameCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
