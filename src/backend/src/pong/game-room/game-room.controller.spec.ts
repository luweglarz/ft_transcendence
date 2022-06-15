import { Test, TestingModule } from '@nestjs/testing';
import { GameRoomController } from './game-room.controller';

describe('GameRoomController', () => {
  let controller: GameRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameRoomController],
    }).compile();

    controller = module.get<GameRoomController>(GameRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
