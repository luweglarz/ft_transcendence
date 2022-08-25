import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatorController } from './authenticator.controller';

describe('AuthenticatorController', () => {
  let controller: AuthenticatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticatorController],
    }).compile();

    controller = module.get<AuthenticatorController>(AuthenticatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
