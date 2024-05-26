import { Test, TestingModule } from '@nestjs/testing';
import { GameAwardService } from './game-award.service';

describe('GameAwardService', () => {
  let service: GameAwardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameAwardService],
    }).compile();

    service = module.get<GameAwardService>(GameAwardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
