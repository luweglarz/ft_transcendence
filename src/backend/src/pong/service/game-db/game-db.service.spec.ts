import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { GameDbService } from './game-db.service';

describe('GameDbService', () => {
  let service: GameDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameDbService, DbService],
    }).compile();

    service = module.get<GameDbService>(GameDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
