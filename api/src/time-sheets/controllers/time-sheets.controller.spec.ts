import { Test, TestingModule } from '@nestjs/testing';
import { TimeSheetsController } from './time-sheets.controller';
import { TimeSheetsService } from '../services/time-sheets.service';

describe('TimeSheetsController', () => {
  let controller: TimeSheetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSheetsController],
      providers: [TimeSheetsService],
    }).compile();

    controller = module.get<TimeSheetsController>(TimeSheetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
