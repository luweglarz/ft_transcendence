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

  it('should create and delete a user', async () => {
    // Create
    await service.user.create({
      data: {
        username: 'Monkey D. Luffy',
        auth: { create: { password: 'abc' } },
      },
    });

    // Find
    const user = await service.user.findFirst({
      where: { username: 'Monkey D. Luffy' },
      include: { auth: true },
    });
    expect(user.auth.password).toBe('abc');

    // Delete
    await service.user.delete({
      where: {
        username: 'Monkey D. Luffy',
      },
    });

    // Not found
    const deletedUser = await service.user.findFirst({
      where: { username: 'Monkey D. Luffy' },
    });
    expect(deletedUser).toBe(null);
  });
});
