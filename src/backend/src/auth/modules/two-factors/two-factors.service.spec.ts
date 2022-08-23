import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { TwoFactorsService } from './two-factors.service';

describe('TwoFactorsService', () => {
  let service: TwoFactorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFactorsService, DbService],
    }).compile();

    service = module.get<TwoFactorsService>(TwoFactorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
