import { Test, TestingModule } from '@nestjs/testing';
import { FetchingController } from './fetching.controller';
import { FetchingService } from './fetching.service';

describe('FetchingController', () => {
  let controller: FetchingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchingController],
      providers: [FetchingService],
    }).compile();

    controller = module.get<FetchingController>(FetchingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
