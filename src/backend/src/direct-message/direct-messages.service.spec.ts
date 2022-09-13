import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from 'src/db/db.module';
import { DirectMessagesService } from './direct-messages.service';

describe('DirectMessagesService', () => {
  let service: DirectMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule, HttpModule],
      providers: [DirectMessagesService],
    }).compile();

    service = module.get<DirectMessagesService>(DirectMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
