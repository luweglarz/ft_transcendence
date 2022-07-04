import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from './db.service';

describe('DbClientService', () => {
  let service: DbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbService],
    }).compile();

    service = module.get<DbService>(DbService);
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
