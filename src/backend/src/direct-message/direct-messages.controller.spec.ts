import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from 'src/db/db.module';
import { DirectMessagesController } from './direct-messages.controller';
import { DirectMessagesService } from './direct-messages.service';

describe('DirectMessagesController', () => {
  let controller: DirectMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule, HttpModule],
      controllers: [DirectMessagesController],
      providers: [DirectMessagesService],
    }).compile();

    controller = module.get<DirectMessagesController>(DirectMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
