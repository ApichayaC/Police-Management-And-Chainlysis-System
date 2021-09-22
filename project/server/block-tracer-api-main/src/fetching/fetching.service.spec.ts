import { Test, TestingModule } from '@nestjs/testing';
import { FetchingService } from './fetching.service';

describe('FetchingService', () => {
  let service: FetchingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchingService],
    }).compile();

    service = module.get<FetchingService>(FetchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
