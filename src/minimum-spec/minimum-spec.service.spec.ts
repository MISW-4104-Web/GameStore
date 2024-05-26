import { Test, TestingModule } from '@nestjs/testing';
import { MinimumSpecService } from './minimum-spec.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('MinimumSpecService', () => {
  let service: MinimumSpecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinimumSpecService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<MinimumSpecService>(MinimumSpecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
