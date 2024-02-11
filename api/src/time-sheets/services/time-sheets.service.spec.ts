import { Test, TestingModule } from '@nestjs/testing';
import { TimeSheetsService } from './time-sheets.service';

describe('TimeSheetsService', () => {
  let service: TimeSheetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeSheetsService],
    }).compile();

    service = module.get<TimeSheetsService>(TimeSheetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
