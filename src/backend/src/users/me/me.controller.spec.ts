import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { AvatarService } from '../services/avatar/avatar.service';
import { MeController } from './me.controller';

describe('MeController', () => {
  let controller: MeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeController],
      providers: [AvatarService, DbService],
    }).compile();

    controller = module.get<MeController>(MeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
