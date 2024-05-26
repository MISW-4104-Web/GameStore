import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentCompanyService } from './development-company.service';

describe('DevelopmentCompanyService', () => {
  let service: DevelopmentCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevelopmentCompanyService],
    }).compile();

    service = module.get<DevelopmentCompanyService>(DevelopmentCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
