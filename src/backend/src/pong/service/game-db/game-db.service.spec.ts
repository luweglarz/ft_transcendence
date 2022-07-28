import { Test, TestingModule } from '@nestjs/testing';
import { GameDbService } from './game-db.service';

describe('GameDbService', () => {
  let service: GameDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameDbService],
    }).compile();

    service = module.get<GameDbService>(GameDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
