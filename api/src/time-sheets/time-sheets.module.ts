import { Module } from '@nestjs/common';
import { TimeSheetsService } from './services/time-sheets.service';
import { TimeSheetsController } from './controllers/time-sheets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../database/entities/employee.entity';
import { TimeSheet } from '../database/entities/time.sheet.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TimeSheet, Employee])],
  controllers: [TimeSheetsController],
  providers: [TimeSheetsService],
})
export class TimeSheetsModule {}
