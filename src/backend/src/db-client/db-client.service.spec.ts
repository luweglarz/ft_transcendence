import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from './db-client.service';

describe('DbClientService', () => {
  let service: DbClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbClientService],
    }).compile();

    service = module.get<DbClientService>(DbClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    await service.user.create({
      data: {
        username: 'Monkey D. Luffy',
        email: 'luffy@mugirawa.jp',
      },
    });
    let user = await service.user.findFirst({
      where: { username: 'Monkey D. Luffy' },
    });
    expect(user.email).toBe('luffy@mugirawa.jp');
    await service.user.delete({
      where: {
        username: 'Monkey D. Luffy',
      },
    });
    user = await service.user.findFirst({
      where: { username: 'Monkey D. Luffy' },
    });
    expect(user).toBe(null);
  });
});
