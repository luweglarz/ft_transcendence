import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { GameGatewayService } from './game-gateway.service';

describe('GameGatewayService', () => {
  let service: GameGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameGatewayService, JwtAuthService],
      imports: [JwtModule],
    }).compile();

    service = module.get<GameGatewayService>(GameGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
