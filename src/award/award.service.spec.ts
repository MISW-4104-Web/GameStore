import { Test, TestingModule } from '@nestjs/testing';
import { AwardService } from './award.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AwardService', () => {
  let service: AwardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwardService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<AwardService>(AwardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
