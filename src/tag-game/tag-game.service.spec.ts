import { Test, TestingModule } from '@nestjs/testing';
import { TagGameService } from './tag-game.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('TagGameService', () => {
  let service: TagGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagGameService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<TagGameService>(TagGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
