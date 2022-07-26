import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { GameGatewayService } from 'src/pong/gateway/game/game-gateway.service';
import { GameGateway } from 'src/pong/gateway/game/game.gateway';
import { GameCoreService } from './game-core.service';

describe('GameCoreService', () => {
  let service: GameCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameCoreService,
        GameGatewayService,
        GameGateway,
        GameGatewayService,
        JwtService,
      ],
    }).compile();

    service = module.get<GameCoreService>(GameCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
