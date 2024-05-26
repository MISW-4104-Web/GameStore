import { Test, TestingModule } from '@nestjs/testing';
import { GameTagService } from './game-tag.service';

describe('GameTagService', () => {
  let service: GameTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameTagService],
    }).compile();

    service = module.get<GameTagService>(GameTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
