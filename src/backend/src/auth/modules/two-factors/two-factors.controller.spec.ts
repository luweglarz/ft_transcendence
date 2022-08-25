import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { TwoFactorsController } from './two-factors.controller';
import { TwoFactorsService } from './two-factors.service';

describe('TwoFactorsController', () => {
  let controller: TwoFactorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwoFactorsController],
      providers: [TwoFactorsService, DbService, JwtService],
    }).compile();

    controller = module.get<TwoFactorsController>(TwoFactorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
