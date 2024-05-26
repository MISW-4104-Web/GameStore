import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentCompanyService } from './development-company.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('DevelopmentCompanyService', () => {
  let service: DevelopmentCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevelopmentCompanyService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<DevelopmentCompanyService>(DevelopmentCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
